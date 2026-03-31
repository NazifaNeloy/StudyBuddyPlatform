import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Manual .env parser for seeding without dependencies
const envContent = fs.readFileSync('.env', 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const [key, value] = line.split('=');
  if (key && value) env[key.trim()] = value.trim();
});

const supabase = createClient(
  env.VITE_SUPABASE_URL,
  env.VITE_SUPABASE_ANON_KEY
);

async function seed() {
  console.log("Starting neural seeding protocol...");

  const circles = [
    { name: "Quantum Physics", description: "Advanced wave functions and particle mechanics deep dives.", image_url: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=400" },
    { name: "Organic Chemistry", description: "Mastering reaction mechanisms and functional group synthesis.", image_url: "https://images.unsplash.com/photo-1532187875302-1df92d701ed8?auto=format&fit=crop&q=80&w=400" },
    { name: "Neurology 401", description: "Mapping brain pathways and synaptic transmission protocols.", image_url: "https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&q=80&w=400" },
    { name: "Algorithmic Theory", description: "Complex data structures and computational efficiency analysis.", image_url: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=400" }
  ];

  for (const circle of circles) {
     const { data, error } = await supabase
       .from('study_circles')
       .insert([circle])
       .select();
     
     if (error) {
        if (error.code === '23505') console.log(`Circle ${circle.name} already materialized.`);
        else console.error("Error seeding circle:", error);
     } else {
        console.log(`Materialized Circle: ${data[0].name}`);
     }
  }

  console.log("Seeding complete. Synthesis successful.");
}

seed();
