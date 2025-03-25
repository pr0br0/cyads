# Notifications System Implementation Plan for CyAds

## Overview

Implement a comprehensive notifications system to:

1. Alert users about new messages
2. Notify about ad approvals/rejections
3. Send saved search alerts
4. Provide system updates

## Architecture

### 1. Database Schema

```sql
-- Create notifications table
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL, -- 'message', 'ad_status', 'search_alert', 'system'
  title VARCHAR(100) NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  related_id UUID, -- ad_id, message_id, etc.
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create trigger for updated_at
CREATE TRIGGER set_notifications_updated_at
BEFORE UPDATE ON notifications
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Create index for faster queries
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_unread ON notifications(user_id, is_read) WHERE is_read = false;
```

### 2. Notification Types

1. **Messages**: When a user receives a new message
2. **Ad Status**: When an ad is approved/rejected/expired
3. **Search Alerts**: When new ads match saved searches
4. **System**: Important platform updates

### 3. Backend Implementation

#### Notification Service

```javascript
// lib/notifications.js
import { supabase } from './supabase';

export async function createNotification(user_id, type, title, message, related_id = null) {
  const { data, error } = await supabase
    .from('notifications')
    .insert([{
      user_id,
      type,
      title,
      message,
      related_id
    }])
    .select()
    .single();

  if (error) {
    console.error('Error creating notification:', error);
    return null;
  }

  return data;
}

export async function getUnreadNotifications(user_id) {
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', user_id)
    .eq('is_read', false)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching notifications:', error);
    return [];
  }

  return data;
}

export async function markAsRead(notification_id) {
  const { data, error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('id', notification_id)
    .select()
    .single();

  if (error) {
    console.error('Error marking notification as read:', error);
    return null;
  }

  return data;
}
```

#### API Endpoints

```javascript
// pages/api/notifications.js
import { supabase } from '@/lib/supabase';
import { getUnreadNotifications, markAsRead } from '@/lib/notifications';

export default async function handler(req, res) {
  const { user } = await supabase.auth.api.getUserByCookie(req);
  
  if (!user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  switch (req.method) {
    case 'GET':
      try {
        const notifications = await getUnreadNotifications(user.id);
        res.status(200).json(notifications);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
      break;

    case 'POST':
      try {
        const { id } = req.body;
        const notification = await markAsRead(id);
        res.status(200).json(notification);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
```

### 4. Real-time Notifications

#### Supabase Realtime Subscription

```javascript
// components/NotificationProvider.jsx
import { createClient } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export function NotificationProvider({ children, userId }) {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!userId) return;

    // Initial fetch
    const fetchNotifications = async () => {
      const { data } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .eq('is_read', false)
        .order('created_at', { ascending: false });
      
      setNotifications(data || []);
      setUnreadCount(data?.length || 0);
    };

    fetchNotifications();

    // Realtime subscription
    const subscription = supabase
      .channel(`notifications:user_id=eq.${userId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`
        },
        (payload) => {
          setNotifications(prev => [payload.new, ...prev]);
          setUnreadCount(prev => prev + 1);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [userId]);

  const markAsRead = async (id) => {
    const { data } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', id)
      .select()
      .single();

    if (data) {
      setNotifications(prev => 
        prev.map(n => n.id === id ? { ...n, is_read: true } : n)
      );
      setUnreadCount(prev => prev - 1);
    }
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        markAsRead
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}
```

### 5. Frontend Components

#### Notification Bell

```jsx
// components/NotificationBell.jsx
import { Bell, Check } from 'lucide-react';
import { useState } from 'react';
import { useNotification } from '@/context/NotificationContext';

export default function NotificationBell() {
  const { notifications, unreadCount, markAsRead } = useNotification();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-full hover:bg-gray-100 relative"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-white rounded-md shadow-lg overflow-hidden z-50">
          <div className="py-1">
            <div className="px-4 py-2 border-b flex justify-between items-center">
              <h3 className="font-medium">Notifications</h3>
              {unreadCount > 0 && (
                <button 
                  onClick={() => notifications.forEach(n => !n.is_read && markAsRead(n.id))}
                  className="text-xs text-primary hover:underline"
                >
                  Mark all as read
                </button>
              )}
            </div>

            {notifications.length === 0 ? (
              <div className="px-4 py-3 text-center text-sm text-gray-500">
                No new notifications
              </div>
            ) : (
              <div className="max-h-96 overflow-y-auto">
                {notifications.map(notification => (
                  <div 
                    key={notification.id}
                    className={`px-4 py-3 border-b hover:bg-gray-50 ${!notification.is_read ? 'bg-blue-50' : ''}`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">{notification.title}</h4>
                        <p className="text-sm text-gray-600">{notification.message}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(notification.created_at).toLocaleString()}
                        </p>
                      </div>
                      {!notification.is_read && (
                        <button 
                          onClick={() => markAsRead(notification.id)}
                          className="p-1 text-gray-400 hover:text-primary"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
```

### 6. Email Notifications

#### Email Service Integration

```javascript
// lib/email.js
import { supabase } from './supabase';

export async function sendEmailNotification(user_id, subject, html) {
  // Get user email
  const { data: user, error } = await supabase
    .from('users')
    .select('email')
    .eq('id', user_id)
    .single();

  if (error || !user) {
    console.error('Error fetching user:', error);
    return false;
  }

  // Send email via Supabase function
  const { error: emailError } = await supabase
    .rpc('send_email', {
      to_email: user.email,
      subject,
      html
    });

  if (emailError) {
    console.error('Error sending email:', emailError);
    return false;
  }

  return true;
}
```

#### Email Templates

```javascript
// templates/adApproved.js
export function adApprovedTemplate(adTitle) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #4f46e5;">Your Ad Has Been Approved!</h1>
      <p>Your ad "${adTitle}" has been approved and is now live on CyAds.</p>
      <p>You can view your ad by clicking the button below:</p>
      <a href="${process.env.NEXT_PUBLIC_SITE_URL}/ads/${adId}" 
         style="display: inline-block; padding: 10px 20px; background-color: #4f46e5; color: white; text-decoration: none; border-radius: 4px; margin-top: 10px;">
        View Ad
      </a>
      <p style="margin-top: 20px;">Thank you for using CyAds!</p>
    </div>
  `;
}
```

### 7. Implementation Timeline

1. **Week 1**: Database setup and backend services
2. **Week 2**: Real-time notification system
3. **Week 3**: Frontend components and UI
4. **Week 4**: Email notifications and testing
5. **Ongoing**: Monitoring and improvements

## Key Features

1. **Real-time updates** via Supabase subscriptions
2. **Unread count** in the notification bell
3. **Mark as read** functionality
4. **Email notifications** for important events
5. **Mobile-friendly** notification interface
6. **Customizable preferences** (future enhancement)

This notification system will significantly improve user engagement and keep users informed about important activities on the platform.
