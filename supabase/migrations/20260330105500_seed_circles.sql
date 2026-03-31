-- Neural Seeding Protocol: Initial Study Circles
INSERT INTO public.study_circles (name, description, image_url)
VALUES 
('Quantum Physics', 'Advanced wave functions and particle mechanics deep dives.', 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=400'),
('Organic Chemistry', 'Mastering reaction mechanisms and functional group synthesis.', 'https://images.unsplash.com/photo-1532187875302-1df92d701ed8?auto=format&fit=crop&q=80&w=400'),
('Neurology 401', 'Mapping brain pathways and synaptic transmission protocols.', 'https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&q=80&w=400'),
('Algorithmic Theory', 'Complex data structures and computational efficiency analysis.', 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=400')
ON CONFLICT DO NOTHING;
