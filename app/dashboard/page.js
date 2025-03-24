'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';
import { Edit, Trash2, Clock, CheckCircle, XCircle } from 'lucide-react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function Dashboard() {
  const { user } = useAuth();
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserAds();
  }, []);

  const fetchUserAds = async () => {
    try {
      const { data, error } = await supabase
        .from('ads')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAds(data);
    } catch (error) {
      console.error('Error fetching ads:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status, autoApproved) => {
    switch (status) {
      case 'active':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle className="w-4 h-4 mr-1" />
            {autoApproved ? 'Auto-approved' : 'Approved'}
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <Clock className="w-4 h-4 mr-1" />
            Pending Review
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <XCircle className="w-4 h-4 mr-1" />
            Rejected
          </span>
        );
      default:
        return status;
    }
  };

  const deleteAd = async (id) => {
    if (window.confirm('Are you sure you want to delete this ad?')) {
      try {
        const { error } = await supabase
          .from('ads')
          .delete()
          .eq('id', id);

        if (error) throw error;
        setAds(ads.filter(ad => ad.id !== id));
      } catch (error) {
        console.error('Error deleting ad:', error);
      }
    }
  };

  if (loading) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Ads</h1>
        <Link
          href="/ads/create"
          className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90"
        >
          Create New Ad
        </Link>
      </div>

      <div className="grid gap-6">
        {ads.map((ad) => (
          <div
            key={ad.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between"
          >
            <div className="flex-1">
              <h2 className="text-xl font-semibold mb-2">{ad.title}</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-2">
                {ad.price} {ad.currency}
              </p>
              <div className="flex flex-wrap gap-2">
                {getStatusBadge(ad.status, ad.auto_approved)}
                <span className="text-sm text-gray-500">
                  Posted: {new Date(ad.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>

            <div className="flex gap-2">
              <Link
                href={`/ads/${ad.id}/edit`}
                className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Link>
              <button
                onClick={() => deleteAd(ad.id)}
                className="inline-flex items-center px-3 py-2 border border-red-300 rounded-md text-sm font-medium text-red-700 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </button>
            </div>
          </div>
        ))}

        {ads.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">
              You haven't posted any ads yet.
            </p>
            <Link
              href="/ads/create"
              className="text-primary hover:text-primary/90 font-medium mt-2 inline-block"
            >
              Create your first ad
            </Link>
          </div>
        )}
      </div>
    </div>
  );
} 