# Notifications System Implementation Plan for CyAds

## Current Status
- No real-time notifications for messages or ad updates
- Users must manually refresh to see updates
- No notification preferences system

## Implementation Strategy

### 1. Database Setup
1. **Create Notifications Table**:
   ```sql
   CREATE TABLE notifications (
     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
     user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
     type TEXT NOT NULL, -- 'message', 'ad_approved', 'ad_viewed', etc.
     content JSONB NOT NULL,
     is_read BOOLEAN DEFAULT false,
     created_at TIMESTAMPTZ DEFAULT NOW()
   );

   CREATE INDEX idx_notifications_user_id ON notifications(user_id);
   ```

2. **Enable Realtime for Notifications**:
   ```js
   // lib/supabase.js
   const notificationsChannel = supabase
     .channel('notifications')
     .on(
       'postgres_changes',
       {
         event: 'INSERT',
         schema: 'public',
         table: 'notifications'
       },
       (payload) => {
         // Handle new notification
       }
     )
     .subscribe();
   ```

### 2. Backend Services
1. **Notification Service**:
   ```js
   // services/notifications.js
   export async function createNotification(user_id, type, content) {
     const { data, error } = await supabase
       .from('notifications')
       .insert([{ user_id, type, content }])
       .select();
     
     if (error) throw error;
     return data;
   }

   export async function markAsRead(notification_id) {
     const { error } = await supabase
       .from('notifications')
       .update({ is_read: true })
       .eq('id', notification_id);
     
     if (error) throw error;
   }
   ```

2. **Trigger Notifications**:
   ```js
   // Example: When a new message is received
   export async function handleNewMessage(message) {
     await createNotification(
       message.receiver_id,
       'message',
       {
         sender_id: message.sender_id,
         ad_id: message.ad_id,
         preview: message.content.substring(0, 50)
       }
     );
   }
   ```

### 3. Frontend Components
1. **Notification Bell Component**:
   ```jsx
   const NotificationBell = () => {
     const [notifications, setNotifications] = useState([]);
     const [unreadCount, setUnreadCount] = useState(0);
     const [isOpen, setIsOpen] = useState(false);

     useEffect(() => {
       // Initial load
       fetchNotifications();
       
       // Realtime subscription
       const channel = supabase
         .channel('user_notifications')
         .on(
           'postgres_changes',
           {
             event: 'INSERT',
             schema: 'public',
             table: 'notifications',
             filter: `user_id=eq.${user.id}`
           },
           (payload) => {
             setNotifications(prev => [payload.new, ...prev]);
             setUnreadCount(prev => prev + 1);
           }
         )
         .subscribe();

       return () => supabase.removeChannel(channel);
     }, []);

     const fetchNotifications = async () => {
       const { data } = await supabase
         .from('notifications')
         .select('*')
         .eq('user_id', user.id)
         .order('created_at', { ascending: false });
       
       setNotifications(data);
       setUnreadCount(data.filter(n => !n.is_read).length);
     };

     const markAsRead = async (id) => {
       await supabase
         .from('notifications')
         .update({ is_read: true })
         .eq('id', id);
       
       setUnreadCount(prev => prev - 1);
     };

     return (
       <div className="notification-bell">
         <button onClick={() => setIsOpen(!isOpen)}>
           <BellIcon />
           {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
         </button>
         
         {isOpen && (
           <div className="notification-dropdown">
             {notifications.map(notification => (
               <NotificationItem 
                 key={notification.id}
                 notification={notification}
                 onMarkAsRead={markAsRead}
               />
             ))}
           </div>
         )}
       </div>
     );
   };
   ```

2. **Notification Preferences**:
   ```jsx
   const NotificationPreferences = () => {
     const [preferences, setPreferences] = useState({
       messages: true,
       ad_approved: true,
       ad_viewed: true,
       promotions: false
     });

     const handleChange = (e) => {
       setPreferences({
         ...preferences,
         [e.target.name]: e.target.checked
       });
     };

     const savePreferences = async () => {
       await supabase
         .from('profiles')
         .update({ notification_preferences: preferences })
         .eq('id', user.id);
     };

     return (
       <div>
         <Checkbox
           name="messages"
           checked={preferences.messages}
           onChange={handleChange}
           label="New Messages"
         />
         <Checkbox
           name="ad_approved"
           checked={preferences.ad_approved}
           onChange={handleChange}
           label="Ad Approved"
         />
         <Checkbox
           name="ad_viewed"
           checked={preferences.ad_viewed}
           onChange={handleChange}
           label="Ad Viewed"
         />
         <Checkbox
           name="promotions"
           checked={preferences.promotions}
           onChange={handleChange}
           label="Promotions"
         />
         <Button onClick={savePreferences}>Save Preferences</Button>
       </div>
     );
   };
   ```

## Implementation Timeline
1. Phase 1 (1 week): Database setup and backend services
2. Phase 2 (1 week): Notification components and real-time integration
3. Phase 3 (1 week): Preferences system and testing
4. Phase 4 (Ongoing): Additional notification types and optimizations
