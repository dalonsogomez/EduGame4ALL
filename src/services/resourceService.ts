import { supabase } from '../lib/supabase';
import type { Resource } from '../types';

export const resourceService = {
  /**
   * Get all resources
   */
  async getAllResources() {
    const { data, error } = await supabase
      .from('resources')
      .select('*')
      .order('is_featured', { ascending: false });

    if (error) throw error;
    return data;
  },

  /**
   * Get resources by category
   */
  async getResourcesByCategory(category: 'jobs' | 'courses' | 'help' | 'legal' | 'community') {
    const { data, error } = await supabase
      .from('resources')
      .select('*')
      .eq('category', category)
      .order('is_featured', { ascending: false });

    if (error) throw error;
    return data;
  },

  /**
   * Get featured resources
   */
  async getFeaturedResources() {
    const { data, error } = await supabase
      .from('resources')
      .select('*')
      .eq('is_featured', true)
      .limit(10);

    if (error) throw error;
    return data;
  },
};
