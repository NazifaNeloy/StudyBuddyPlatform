import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ScanLine, 
  Upload, 
  X, 
  Sparkles, 
  Save, 
  Copy, 
  RefreshCw,
  Zap,
  CheckCircle2,
  FileText
} from 'lucide-react';
import { geminiActions } from '../lib/gemini';
import { supabase, storageActions } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

const Scanner = () => {
  const { user } = useAuth();
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [saved, setSaved] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
      setResult(null);
      setSaved(false);
    }
  };

  const startScan = async () => {
    if (!preview) return;
    setLoading(true);
    
    try {
      // 1. Convert to base64
      const base64Data = preview.split(',')[1];
      const mimeType = image.type;

      // 2. Call Gemini API
      const scanResult = await geminiActions.scanNotes(base64Data, mimeType);
      setResult(scanResult);
    } catch (error) {
      alert('Error scanning image: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const saveToLibrary = async () => {
    if (!result || !image) return;
    setLoading(true);

    try {
      // 1. Upload original image to storage
      const fileExt = image.name.split('.').pop();
      const fileName = `scans/${Math.random()}.${fileExt}`;
      const { error: uploadError } = await storageActions.uploadFile('resources', fileName, image);
      
      if (uploadError) throw uploadError;
      
      const url = storageActions.getPublicUrl('resources', fileName);

      // 2. Save metadata and text to DB
      const { error: dbError } = await supabase.from('resources').insert([
        {
          title: result.title || image.name,
          type: 'image',
          url: url,
          user_id: user.id,
          metadata: {
            extracted_text: result.text,
            keywords: result.keywords,
            is_ai_scanned: true
          }
        }
      ]);

      if (!dbError) setSaved(true);
    } catch (error) {
      alert('Error saving artifact: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-10 max-w-4xl mx-auto pb-20">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight mb-2 italic flex items-center justify-center gap-3">
          Smart Artifact Scanner
          <div className="bg-purple-500/10 p-2 rounded-xl text-purple-400">
            <Sparkles className="w-6 h-6 animate-pulse" />
          </div>
        </h1>
        <p className="text-gray-400 max-w-lg mx-auto">
          Convert your ink-and-paper notes into searchable AI-powered digital assets in seconds.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 items-start">
        {/* Upload Column */}
        <div className="space-y-6">
          <div className={`relative border-2 border-dashed rounded-3xl p-8 text-center transition-all overflow-hidden ${
             preview ? 'border-purple-500/50 p-2' : 'border-white/10 hover:border-white/20'
          }`}>
            {preview ? (
              <div className="relative group">
                <img src={preview} alt="Note Preview" className="w-full h-[400px] object-cover rounded-2xl" />
                <button 
                  onClick={() => { setImage(null); setPreview(null); }}
                  className="absolute top-4 right-4 bg-black/60 hover:bg-black text-white p-2 rounded-full backdrop-blur-md transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
                <div className="absolute inset-x-0 bottom-4 px-4">
                   <div className="bg-black/60 backdrop-blur-md p-3 rounded-2xl text-xs flex items-center justify-center gap-2">
                     <FileText className="w-4 h-4 text-purple-400" />
                     {image.name} ({(image.size / 1024).toFixed(1)} KB)
                   </div>
                </div>
              </div>
            ) : (
              <div className="py-20 flex flex-col items-center gap-4 relative">
                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Upload className="w-8 h-8 text-gray-500" />
                </div>
                <div>
                  <h3 className="font-bold mb-1">Upload Note Artifact</h3>
                  <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">Image Files Only (JPG, PNG)</p>
                </div>
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={handleImageChange}
                  className="absolute inset-0 opacity-0 cursor-pointer" 
                />
              </div>
            )}
          </div>

          <button 
            onClick={startScan}
            disabled={!preview || loading || !!result}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold py-4 rounded-2xl shadow-xl shadow-purple-500/20 disabled:opacity-50 flex items-center justify-center gap-3 active:scale-95 transition-all text-lg"
          >
            {loading ? 'Consulting Gemini...' : (
              <>
                <ScanLine className="w-6 h-6" />
                Scan Now
              </>
            )}
          </button>
        </div>

        {/* AI Result Column */}
        <div className="space-y-6 min-h-[500px]">
          <AnimatePresence mode="wait">
            {!result ? (
              <motion.div 
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full glass rounded-3xl border border-white/5 flex flex-col items-center justify-center p-10 text-center text-gray-600 italic"
              >
                <Zap className="w-12 h-12 mb-4 opacity-20" />
                <p>Submit your notes to unleash the AI's wisdom.</p>
              </motion.div>
            ) : (
              <motion.div 
                key="result"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass rounded-3xl border border-purple-500/20 p-8 space-y-6 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-4">
                  <div className="flex gap-2">
                    <button className="bg-white/5 hover:bg-white/10 p-2 rounded-xl transition-all">
                      <Copy className="w-4 h-4 text-gray-400" />
                    </button>
                    <button onClick={() => { setResult(null); setImage(null); setPreview(null); }} className="bg-white/5 hover:bg-white/10 p-2 rounded-xl transition-all">
                      <RefreshCw className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                </div>

                <div>
                   <h3 className="text-xs font-black text-purple-400 uppercase tracking-[0.3em] mb-4">Digitized Content</h3>
                   <input 
                     type="text" 
                     value={result.title}
                     onChange={(e) => setResult({...result, title: e.target.value})}
                     className="text-2xl font-bold bg-transparent border-none outline-none w-full p-0 italic mb-4"
                   />
                   
                   <div className="flex flex-wrap gap-2 mb-6">
                      {result.keywords.map((kw, i) => (
                        <span key={i} className="bg-blue-500/10 text-blue-400 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-blue-500/20">
                          #{kw}
                        </span>
                      ))}
                   </div>

                   <div className="bg-white/5 rounded-2xl p-6 border border-white/5 max-h-[250px] overflow-y-auto text-sm leading-relaxed text-gray-300 font-mono scroll-thin">
                      {result.text}
                   </div>
                </div>

                <div className="pt-4">
                  <button 
                    onClick={saveToLibrary}
                    disabled={saved || loading}
                    className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg ${
                      saved 
                        ? 'bg-green-500/20 text-green-400 border border-green-500/20' 
                        : 'bg-white text-black hover:bg-gray-200 shadow-white/10'
                    }`}
                  >
                    {saved ? (
                      <>
                         <CheckCircle2 className="w-5 h-5" />
                         Linked to Circle Library
                      </>
                    ) : (
                      <>
                        <Save className="w-5 h-5" />
                        Persist Artifact
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Scanner;
