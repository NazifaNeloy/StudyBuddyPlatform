import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { useStats } from '../hooks/useStats';
import { geminiActions } from '../lib/gemini';
import { supabase } from '../lib/supabase';
import Layout from '../components/Layout';

// Modular Architecture Imports
import ScannerHero from '../components/scanner/ScannerHero';
import UploadZone from '../components/scanner/UploadZone';
import ProcessingFeedback from '../components/scanner/ProcessingFeedback';
import SplitViewResult from '../components/scanner/SplitViewResult';
import MetadataSidebar from '../components/scanner/MetadataSidebar';

const Scanner = () => {
  const { user } = useAuth();
  const { updateFocusStats } = useStats();
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState('');
  const [error, setError] = useState(null);
  const [circles, setCircles] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [step, setStep] = useState(1); // 1: Upload, 2: Processing, 3: Results

  React.useEffect(() => {
    if (user) fetchCircles();
  }, [user]);

  const fetchCircles = async () => {
    try {
      const { data, error } = await supabase
        .from('circle_members')
        .select('study_circles(id, name)')
        .eq('user_id', user.id);
      
      if (error) throw error;
      setCircles(data.map(d => d.study_circles).filter(Boolean));
    } catch (err) {
      console.error('Circle Fetch Error:', err);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setError(null);
      setScanResult(null);
      setIsEditing(false);
    }
  };

  const handlePerformExtraction = async () => {
    if (!selectedFile) return;
    setStep(2);
    setIsScanning(true);
    
    try {
      const result = await geminiActions.analyzeStudyMaterial(selectedFile);
      setScanResult(result);
      setEditedText(result.fullText);
      setStep(3);
      toast.success("Neural Analysis Complete!");
    } catch (err) {
      console.error('Extraction Failure:', err);
      toast.error(err.message || "The AI portal failed to materialize the scan.");
      setStep(1);
    } finally {
      setIsScanning(false);
    }
  };

  const handleSaveToLibrary = async ({ title, circleId, keywords }) => {
    if (!scanResult || !selectedFile) return;
    setIsSaving(true);
    
    try {
      // 1. Upload to Storage
      const fileExt = selectedFile.name.split('.').pop();
      const filePath = `${user.id}/${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('resources')
        .upload(filePath, selectedFile);

      if (uploadError) throw uploadError;

      // 2. Get Public URL
      const { data: { publicUrl } } = supabase.storage
        .from('resources')
        .getPublicUrl(filePath);

      // 3. Insert into Resources Table
      const { error: insertError } = await supabase
        .from('resources')
        .insert([{
          title: title || scanResult.title,
          url: publicUrl,
          file_path: filePath,
          type: selectedFile.type,
          circle_id: circleId || null, // Allow for personal artifacts (Empty string becomes NULL)
          user_id: user.id,
          summary: scanResult.summary,
          key_points: keywords || scanResult.keyPoints || [],
          content: editedText || scanResult.fullText,
          file_size: selectedFile.size
        }]);

      if (insertError) throw insertError;

      // 4. Reward XP
      await updateFocusStats(5);

      toast.success("Neural Artifact materialized in your library!");
      setStep(1);
      setSelectedFile(null);
      setPreviewUrl(null);
      setScanResult(null);
      setIsEditing(false);
    } catch (err) {
      toast.error("Failed to save artifact: " + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Layout>
      <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-6">
          <h2 className="text-3xl font-black font-headline tracking-tighter uppercase italic text-primary">Smart Scanner</h2>
          <div className="hidden lg:flex gap-6">
             {['Dashboard', 'Circles', 'Library', 'Calendar'].map((link) => (
                <Link 
                  key={link} 
                  to={`/${link.toLowerCase()}`} 
                  className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant opacity-40 hover:opacity-100 transition-all font-label"
                >
                  {link}
                </Link>
              ))}
              <span className="text-[10px] font-black uppercase tracking-widest text-primary border-b-2 border-primary pb-1 italic font-label">Scanner</span>
          </div>
        </div>
        
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="flex-1 md:w-64 bg-surface-container-high rounded-full px-6 py-3 flex items-center gap-3 border border-black/5 shadow-sm">
            <span className="material-symbols-outlined text-outline text-xl">search</span>
            <input 
              type="text" 
              placeholder="Search Artifacts..." 
              className="bg-transparent border-none focus:ring-0 text-xs font-black uppercase tracking-widest w-full outline-none placeholder:opacity-30" 
            />
          </div>
          
          <div className="flex items-center gap-3">
             <button className="p-3 rounded-2xl bg-white border border-black/5 shadow-ref-sm text-primary hover:scale-110 active:scale-95 transition-all">
                <span className="material-symbols-outlined">notifications</span>
             </button>
             <div className="w-12 h-12 rounded-full border-2 border-primary-container p-0.5 overflow-hidden shadow-ref-sm">
                <img 
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.id}`} 
                  alt="User Avatar" 
                  className="w-full h-full object-cover rounded-full" 
                />
             </div>
          </div>
        </div>
      </header>

      <div className="max-w-[1400px] mx-auto pb-20">
        <ScannerHero />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          <div className="lg:col-span-12 xl:col-span-8 space-y-10">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div 
                  key="upload" 
                  initial={{ opacity: 0, scale: 0.98 }} 
                  animate={{ opacity: 1, scale: 1 }} 
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="space-y-10"
                >
                  <UploadZone 
                    selectedFile={selectedFile} 
                    previewUrl={previewUrl} 
                    onFileSelect={handleFileSelect} 
                  />
                  {selectedFile && (
                    <div className="flex justify-center">
                       <button 
                        onClick={handlePerformExtraction}
                        className="bg-brand-black text-white px-16 py-5 rounded-full font-headline font-black text-xl italic tracking-tighter shadow-xl hover:shadow-brand-purple/20 transition-all hover:-translate-y-1 active:scale-95"
                       >
                         START EXTRACTION
                       </button>
                    </div>
                  )}
                </motion.div>
              )}

              {step === 2 && (
                <motion.div 
                  key="processing" 
                  initial={{ opacity: 0, y: 20 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  exit={{ opacity: 0, y: -20 }}
                >
                  <ProcessingFeedback filename={selectedFile?.name} />
                </motion.div>
              )}

              {(step === 3 && scanResult) && (
                <motion.div 
                  key="result" 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }}
                  className="space-y-10"
                >
                  <SplitViewResult 
                    previewUrl={previewUrl} 
                    extractedText={scanResult.fullText}
                    isEditing={isEditing}
                    editedText={editedText}
                    onTextChange={setEditedText}
                    confidence={98.4}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="lg:col-span-12 xl:col-span-4 self-stretch">
            <MetadataSidebar 
              title={scanResult?.title} 
              summary={scanResult?.summary}
              keywords={scanResult?.keyPoints}
              circles={circles}
              isSaving={isSaving}
              onSave={handleSaveToLibrary}
              onManualCorrection={() => setIsEditing(!isEditing)}
            />
          </div>

        </div>
      </div>
    </Layout>
  );
};

export default Scanner;
