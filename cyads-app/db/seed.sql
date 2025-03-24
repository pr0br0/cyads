-- Seed Categories
INSERT INTO categories (name_en, name_el, name_ru, slug, icon, color)
VALUES 
  ('Property', 'Ακίνητα', 'Недвижимость', 'property', 'Home', 'bg-blue-100 dark:bg-blue-900/20'),
  ('Vehicles', 'Οχήματα', 'Транспорт', 'vehicles', 'Car', 'bg-red-100 dark:bg-red-900/20'),
  ('Jobs', 'Εργασία', 'Работа', 'jobs', 'Briefcase', 'bg-green-100 dark:bg-green-900/20'),
  ('Services', 'Υπηρεσίες', 'Услуги', 'services', 'Wrench', 'bg-purple-100 dark:bg-purple-900/20'),
  ('Electronics', 'Ηλεκτρονικά', 'Электроника', 'electronics', 'Smartphone', 'bg-yellow-100 dark:bg-yellow-900/20'),
  ('Furniture', 'Έπιπλα', 'Мебель', 'furniture', 'Sofa', 'bg-teal-100 dark:bg-teal-900/20');

-- Seed Property subcategories
WITH property_id AS (SELECT id FROM categories WHERE slug = 'property')
INSERT INTO categories (name_en, name_el, name_ru, slug, parent_id)
VALUES 
  ('Apartments', 'Διαμερίσματα', 'Квартиры', 'apartments', (SELECT id FROM property_id)),
  ('Houses', 'Σπίτια', 'Дома', 'houses', (SELECT id FROM property_id)),
  ('Land', 'Οικόπεδα', 'Земля', 'land', (SELECT id FROM property_id)),
  ('Commercial', 'Επαγγελματικοί Χώροι', 'Коммерческая', 'commercial', (SELECT id FROM property_id));

-- Seed Vehicles subcategories
WITH vehicles_id AS (SELECT id FROM categories WHERE slug = 'vehicles')
INSERT INTO categories (name_en, name_el, name_ru, slug, parent_id)
VALUES 
  ('Cars', 'Αυτοκίνητα', 'Автомобили', 'cars', (SELECT id FROM vehicles_id)),
  ('Motorcycles', 'Μοτοσυκλέτες', 'Мотоциклы', 'motorcycles', (SELECT id FROM vehicles_id)),
  ('Boats', 'Σκάφη', 'Лодки', 'boats', (SELECT id FROM vehicles_id)),
  ('Parts & Accessories', 'Ανταλλακτικά & Αξεσουάρ', 'Запчасти и аксессуары', 'parts', (SELECT id FROM vehicles_id));

-- Seed Jobs subcategories
WITH jobs_id AS (SELECT id FROM categories WHERE slug = 'jobs')
INSERT INTO categories (name_en, name_el, name_ru, slug, parent_id)
VALUES 
  ('Full-time', 'Πλήρης Απασχόληση', 'Полная занятость', 'full-time', (SELECT id FROM jobs_id)),
  ('Part-time', 'Μερική Απασχόληση', 'Частичная занятость', 'part-time', (SELECT id FROM jobs_id)),
  ('Temporary', 'Προσωρινή', 'Временная', 'temporary', (SELECT id FROM jobs_id)),
  ('Internship', 'Πρακτική Άσκηση', 'Стажировка', 'internship', (SELECT id FROM jobs_id));

-- Seed Cyprus locations
INSERT INTO locations (name_en, name_el, name_ru, slug, coordinates)
VALUES 
  ('Nicosia', 'Λευκωσία', 'Никосия', 'nicosia', ST_SetSRID(ST_MakePoint(33.3823, 35.1856), 4326)),
  ('Limassol', 'Λεμεσός', 'Лимассол', 'limassol', ST_SetSRID(ST_MakePoint(33.0476, 34.6786), 4326)),
  ('Larnaca', 'Λάρνακα', 'Ларнака', 'larnaca', ST_SetSRID(ST_MakePoint(33.6233, 34.9229), 4326)),
  ('Paphos', 'Πάφος', 'Пафос', 'paphos', ST_SetSRID(ST_MakePoint(32.4297, 34.7720), 4326)),
  ('Famagusta', 'Αμμόχωστος', 'Фамагуста', 'famagusta', ST_SetSRID(ST_MakePoint(33.9400, 35.1175), 4326)),
  ('Kyrenia', 'Κερύνεια', 'Кирения', 'kyrenia', ST_SetSRID(ST_MakePoint(33.3139, 35.3417), 4326));

-- Seed some Nicosia areas
WITH nicosia_id AS (SELECT id FROM locations WHERE slug = 'nicosia')
INSERT INTO locations (name_en, name_el, name_ru, slug, coordinates, parent_id)
VALUES 
  ('Strovolos', 'Στρόβολος', 'Стровoлос', 'strovolos', ST_SetSRID(ST_MakePoint(33.3400, 35.1300), 4326), (SELECT id FROM nicosia_id)),
  ('Lakatamia', 'Λακατάμια', 'Лакатамия', 'lakatamia', ST_SetSRID(ST_MakePoint(33.3000, 35.1100), 4326), (SELECT id FROM nicosia_id)),
  ('Aglantzia', 'Αγλαντζιά', 'Агланция', 'aglantzia', ST_SetSRID(ST_MakePoint(33.4000, 35.1600), 4326), (SELECT id FROM nicosia_id));

-- Seed some Limassol areas
WITH limassol_id AS (SELECT id FROM locations WHERE slug = 'limassol')
INSERT INTO locations (name_en, name_el, name_ru, slug, coordinates, parent_id)
VALUES 
  ('Germasogeia', 'Γερμασόγεια', 'Гермасойя', 'germasogeia', ST_SetSRID(ST_MakePoint(33.0800, 34.7000), 4326), (SELECT id FROM limassol_id)),
  ('Mesa Geitonia', 'Μέσα Γειτονιά', 'Меса Гитония', 'mesa-geitonia', ST_SetSRID(ST_MakePoint(33.0400, 34.6900), 4326), (SELECT id FROM limassol_id)),
  ('Agios Athanasios', 'Άγιος Αθανάσιος', 'Агиос Атанасиос', 'agios-athanasios', ST_SetSRID(ST_MakePoint(33.0200, 34.6800), 4326), (SELECT id FROM limassol_id)); 