import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../lib/supabase';
import { Check, Hash, Info, Loader2 } from 'lucide-react';

const TAG_CATEGORIES = [
  "Data Structures (DSA)",
  "Algorithms",
  "Web Development",
  "React",
  "Cybersecurity",
  "IELTS Prep",
  "Database Systems",
  "Competitive Programming",
  "Machine Learning"
];

const TagSelector = ({ onComplete }) => {
  const [selectedTags, setSelectedTags] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dbTags, setDbTags] = useState([]);
  const [error, setError] = useState(null);

  // Sync/Fetch tags from Supabase to ensure IDs match
  useEffect(() => {
    const fetchTags = async () => {
      // First, check if tags exist, if not, we assume they are seeded or we use the names
      const { data, error } = await supabase.from('tags').select('*');
      if (error) {
        console.error('Error fetching tags:', error);
        setError('Failed to load interests. Please try again.');
      } else {
        setDbTags(data);
      }
    };
    fetchTags();
  }, []);

  const toggleTag = (tagName) => {
    if (selectedTags.includes(tagName)) {
      setSelectedTags(selectedTags.filter(t => t !== tagName));
    } else if (selectedTags.length < 5) {
      setSelectedTags([...selectedTags, tagName]);
    }
  };

  const handleSave = async () => {
    if (selectedTags.length === 0) return;
    
    setLoading(true);
    setError(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No authenticated user found.');

      // Map names to IDs from our dbTags list
      const tagsToInsert = selectedTags.map(tagName => {
        const tag = dbTags.find(t => t.name === tagName);
        return {
          user_id: user.id,
          tag_id: tag?.id
        };
      }).filter(item => item.tag_id);

      if (tagsToInsert.length === 0) {
        throw new Error('Selected tags not found in database. Please ensure Phase 1 SQL was run.');
      }

      const { error: insertError } = await supabase
        .from('user_tags')
        .insert(tagsToInsert);

      if (insertError) throw insertError;

      // Notify parent of completion
      if (onComplete) onComplete();
      
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 relative">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl text-center mb-12"
      >
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
          What are you studying?
        </h1>
        <p className="text-lg text-gray-500 max-w-md mx-auto">
          Select up to <span className="font-bold text-gray-900">5 topics</span> to find your perfect study partners.
        </p>
      </motion.div>

      <div className="w-full max-w-3xl grid grid-cols-2 md:grid-cols-3 gap-4 mb-32">
        {TAG_CATEGORIES.map((tag) => {
          const isSelected = selectedTags.includes(tag);
          return (
            <motion.button
              key={tag}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => toggleTag(tag)}
              className={`
                relative flex items-center justify-center gap-2 p-4 rounded-2xl border-2 transition-all duration-300 text-sm font-semibold
                ${isSelected 
                  ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-200' 
                  : 'bg-gray-50 border-gray-100 text-gray-600 hover:border-indigo-200 hover:bg-white'}
              `}
            >
              <AnimatePresence mode="wait">
                {isSelected ? (
                  <motion.div
                    key="check"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                  >
                    <Check className="w-4 h-4" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="hash"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                  >
                    <Hash className="w-4 h-4 text-gray-300" />
                  </motion.div>
                )}
              </AnimatePresence>
              {tag}
            </motion.button>
          );
        })}
      </div>

      {error && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed bottom-28 flex items-center gap-2 bg-red-50 text-red-600 px-4 py-3 rounded-xl border border-red-100 text-sm font-medium mb-4"
        >
          <Info className="w-4 h-4" />
          {error}
        </motion.div>
      )}

      {/* Sticky Bottom Bar */}
      <div className="fixed bottom-0 left-0 w-full bg-white/80 backdrop-blur-md border-t border-gray-100 p-6 flex justify-center">
        <motion.button
          disabled={selectedTags.length === 0 || loading}
          whileHover={selectedTags.length > 0 && !loading ? { scale: 1.02 } : {}}
          whileTap={selectedTags.length > 0 && !loading ? { scale: 0.98 } : {}}
          onClick={handleSave}
          className={`
            w-full max-w-md py-4 rounded-2xl font-bold text-lg shadow-xl transition-all flex items-center justify-center gap-3
            ${selectedTags.length > 0 && !loading
              ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-200'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'}
          `}
        >
          {loading ? (
            <>
              <Loader2 className="w-6 h-6 animate-spin" />
              Saving Interests...
            </>
          ) : (
            <>
              Save Interests
              <span className="bg-white/20 px-2 py-0.5 rounded text-sm">
                {selectedTags.length}/5
              </span>
            </>
          )}
        </motion.button>
      </div>
    </div>
  );
};

export default TagSelector;
