import { pool, query } from '../config/database.js';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

// Sample companies data
const companiesData = [
  {
    company_name: 'TechStart Myanmar',
    company_size: '11-50',
    industry: 'Technology',
    location: 'Yangon',
    website: 'https://techstart.mm',
    description: 'Leading technology startup in Myanmar, building innovative solutions for local and international markets.',
    hiring_urgency: 'high',
    roles_count: '5-10'
  },
  {
    company_name: 'Digital Solutions Myanmar',
    company_size: '51-200',
    industry: 'Technology',
    location: 'Yangon',
    website: 'https://digitalsolutions.mm',
    description: 'Full-service digital agency providing web development, mobile apps, and digital marketing solutions.',
    hiring_urgency: 'medium',
    roles_count: '3-5'
  },
  {
    company_name: 'Build Myanmar Co.',
    company_size: '201-500',
    industry: 'Construction',
    location: 'Mandalay',
    website: 'https://buildmyanmar.mm',
    description: 'Premier construction company specializing in residential and commercial projects across Myanmar.',
    hiring_urgency: 'high',
    roles_count: '10+'
  },
  {
    company_name: 'Design Studio Yangon',
    company_size: '11-50',
    industry: 'Design',
    location: 'Yangon',
    website: 'https://designstudio.mm',
    description: 'Creative design agency focused on UI/UX design, branding, and visual identity for startups and enterprises.',
    hiring_urgency: 'medium',
    roles_count: '2-3'
  },
  {
    company_name: 'Growth Partners Myanmar',
    company_size: '51-200',
    industry: 'Business',
    location: 'Yangon',
    website: 'https://growthpartners.mm',
    description: 'Business consulting firm helping companies scale and grow through strategic partnerships and market expansion.',
    hiring_urgency: 'low',
    roles_count: '1-2'
  },
  {
    company_name: 'App Innovators',
    company_size: '11-50',
    industry: 'Technology',
    location: 'Yangon',
    website: 'https://appinnovators.mm',
    description: 'Mobile app development company creating innovative apps for iOS and Android platforms.',
    hiring_urgency: 'high',
    roles_count: '5-8'
  }
];

// Sample jobs data
const jobsData = [
  // TechStart Myanmar Jobs
  {
    company_index: 0,
    title: 'Frontend Developer',
    description: 'We are looking for a skilled Frontend Developer to join our growing team. You will work on building modern web applications using React, TypeScript, and modern CSS frameworks. This role offers opportunities to work with cutting-edge technologies and contribute to products used by thousands of users across Myanmar.',
    requirements: 'Strong proficiency in React and JavaScript, experience with TypeScript, understanding of responsive design principles, good communication skills. Minimum 2 years of experience in frontend development.',
    location: 'Yangon',
    job_type: 'Full-time',
    work_mode: 'Hybrid',
    salary: '800K - 1.2M MMK',
    skills: ['React', 'TypeScript', 'Responsive UI', 'JavaScript', 'APIs'],
    tier: 'featured'
  },
  {
    company_index: 0,
    title: 'Backend Developer',
    description: 'Join our backend team to build scalable APIs and services. Work with Node.js, PostgreSQL, and cloud infrastructure. Help design and implement robust backend systems that power our applications.',
    requirements: 'Experience with Node.js, PostgreSQL, RESTful API design, cloud services (AWS/Digital Ocean). Understanding of database design and optimization. 2+ years backend development experience.',
    location: 'Yangon',
    job_type: 'Full-time',
    work_mode: 'On-site',
    salary: '900K - 1.4M MMK',
    skills: ['Node.js', 'PostgreSQL', 'REST APIs', 'AWS', 'Docker'],
    tier: 'standard'
  },
  // Digital Solutions Myanmar Jobs
  {
    company_index: 1,
    title: 'Full Stack Developer',
    description: 'Build and maintain web applications for local and international clients. Work with modern tech stack including Node.js, React, and PostgreSQL. Collaborate with designers and project managers to deliver high-quality solutions.',
    requirements: 'Experience with both frontend and backend development, knowledge of databases, API design, and deployment workflows. Full-stack development experience preferred.',
    location: 'Yangon',
    job_type: 'Freelance',
    work_mode: 'Remote',
    salary: '900K - 1.5M MMK',
    skills: ['Node.js', 'React', 'PostgreSQL', 'REST APIs', 'Deployment'],
    tier: 'standard'
  },
  {
    company_index: 1,
    title: 'DevOps Engineer',
    description: 'Manage our cloud infrastructure and deployment pipelines. Ensure high availability and performance of our applications. Work with CI/CD, Docker, and cloud platforms.',
    requirements: 'Experience with cloud platforms (AWS/Digital Ocean), Docker, CI/CD pipelines, Linux administration. Knowledge of monitoring and logging tools.',
    location: 'Yangon',
    job_type: 'Full-time',
    work_mode: 'Hybrid',
    salary: '1M - 1.6M MMK',
    skills: ['Docker', 'CI/CD', 'AWS', 'Linux', 'Monitoring'],
    tier: 'standard'
  },
  // Build Myanmar Co. Jobs
  {
    company_index: 2,
    title: 'Project Manager',
    description: 'Lead construction projects from planning to completion. Coordinate with teams, manage timelines, and ensure quality delivery. Oversee multiple construction sites and ensure safety standards.',
    requirements: 'PMP certification preferred, 3+ years in project management, excellent organizational skills. Experience in construction industry required.',
    location: 'Mandalay',
    job_type: 'Full-time',
    work_mode: 'On-site',
    salary: '700K - 1M MMK',
    skills: ['Project Planning', 'Stakeholder Mgmt', 'Risk Mgmt', 'Scheduling'],
    tier: 'standard'
  },
  {
    company_index: 2,
    title: 'Site Engineer',
    description: 'Supervise construction sites, ensure quality control, and coordinate with contractors. Monitor progress and ensure compliance with building codes and safety regulations.',
    requirements: 'Engineering degree, 2+ years construction experience, strong technical knowledge. Ability to read blueprints and manage teams.',
    location: 'Mandalay',
    job_type: 'Full-time',
    work_mode: 'On-site',
    salary: '600K - 900K MMK',
    skills: ['Construction', 'Quality Control', 'Safety', 'Team Management'],
    tier: 'free'
  },
  // Design Studio Yangon Jobs
  {
    company_index: 3,
    title: 'UI/UX Designer',
    description: 'Join our creative team to design beautiful and intuitive user experiences for web and mobile applications. Work closely with developers to bring your designs to life. Create design systems and maintain brand consistency.',
    requirements: 'Proficiency in Figma and Adobe Creative Suite, strong portfolio, understanding of user-centered design principles. 2+ years UI/UX design experience.',
    location: 'Yangon',
    job_type: 'Internship',
    work_mode: 'Hybrid',
    salary: '300K - 500K MMK',
    skills: ['Figma', 'Wireframing', 'UI Systems', 'User Research'],
    tier: 'standard'
  },
  {
    company_index: 3,
    title: 'Graphic Designer',
    description: 'Create visual designs for branding, marketing materials, and digital campaigns. Work on diverse projects from logo design to social media graphics.',
    requirements: 'Strong portfolio, proficiency in Adobe Creative Suite, understanding of branding principles. Creative thinking and attention to detail.',
    location: 'Yangon',
    job_type: 'Part-time',
    work_mode: 'Remote',
    salary: '400K - 600K MMK',
    skills: ['Adobe Creative Suite', 'Branding', 'Typography', 'Illustration'],
    tier: 'free'
  },
  // Growth Partners Myanmar Jobs
  {
    company_index: 4,
    title: 'Business Development Manager',
    description: 'Drive business growth by identifying new opportunities and partnerships. Build relationships with clients and expand our market presence. Develop strategic plans for market expansion.',
    requirements: 'Strong sales background, excellent communication skills, experience in B2B relationships. 3+ years in business development or sales.',
    location: 'Yangon',
    job_type: 'Full-time',
    work_mode: 'Hybrid',
    salary: '800K - 1.2M MMK',
    skills: ['B2B Sales', 'Negotiation', 'Pipeline', 'Partnerships'],
    tier: 'standard'
  },
  // App Innovators Jobs
  {
    company_index: 5,
    title: 'Mobile App Developer',
    description: 'Develop iOS and Android applications using React Native and modern frameworks. Create engaging mobile experiences for our growing user base. Work on both new features and maintenance.',
    requirements: 'Experience with React Native or Flutter, understanding of mobile UI/UX patterns, App Store deployment experience. 2+ years mobile development.',
    location: 'Yangon',
    job_type: 'Internship',
    work_mode: 'Hybrid',
    salary: '750K - 1.1M MMK',
    skills: ['React Native', 'Mobile UI', 'State Mgmt', 'API Integration'],
    tier: 'standard'
  },
  {
    company_index: 5,
    title: 'iOS Developer',
    description: 'Build native iOS applications using Swift and SwiftUI. Create polished, performant apps that users love. Work on new features and optimize existing code.',
    requirements: 'Proficiency in Swift, experience with SwiftUI or UIKit, understanding of iOS design guidelines. App Store submission experience.',
    location: 'Yangon',
    job_type: 'Full-time',
    work_mode: 'Remote',
    salary: '1M - 1.5M MMK',
    skills: ['Swift', 'SwiftUI', 'iOS', 'Xcode', 'App Store'],
    tier: 'featured'
  },
  {
    company_index: 5,
    title: 'Android Developer',
    description: 'Develop native Android applications using Kotlin and Jetpack Compose. Build modern, responsive Android apps following Material Design guidelines.',
    requirements: 'Proficiency in Kotlin, experience with Jetpack Compose or XML layouts, understanding of Android architecture. Google Play Store experience.',
    location: 'Yangon',
    job_type: 'Full-time',
    work_mode: 'Hybrid',
    salary: '950K - 1.4M MMK',
    skills: ['Kotlin', 'Jetpack Compose', 'Android', 'Material Design'],
    tier: 'standard'
  }
];

async function seedDatabase() {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    console.log('🌱 Starting database seeding...\n');

    // Create employer users and companies
    const createdCompanies = [];
    
    for (let i = 0; i < companiesData.length; i++) {
      const companyData = companiesData[i];
      
      // Create employer user
      const hashedPassword = await bcrypt.hash('password123', 10);
      const userEmail = `employer${i + 1}@company.mm`;
      
      const userResult = await client.query(
        `INSERT INTO users (email, password_hash, name, role, location, is_active, is_verified)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         ON CONFLICT (email) DO UPDATE SET email = EXCLUDED.email
         RETURNING id`,
        [
          userEmail,
          hashedPassword,
          `${companyData.company_name} Admin`,
          'hirer',
          companyData.location,
          true,
          true
        ]
      );
      
      const userId = userResult.rows[0].id;
      console.log(`✅ Created user: ${userEmail} (${userId})`);

      // Create company
      const companyResult = await client.query(
        `INSERT INTO companies (
          user_id, company_name, company_size, industry, location,
          website, description, hiring_urgency, roles_count, setup_complete, setup_date
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        ON CONFLICT DO NOTHING
        RETURNING id`,
        [
          userId,
          companyData.company_name,
          companyData.company_size,
          companyData.industry,
          companyData.location,
          companyData.website,
          companyData.description,
          companyData.hiring_urgency,
          companyData.roles_count,
          true,
          new Date()
        ]
      );
      
      if (companyResult.rows.length > 0) {
        const companyId = companyResult.rows[0].id;
        createdCompanies.push({ id: companyId, userId, name: companyData.company_name });
        console.log(`✅ Created company: ${companyData.company_name} (${companyId})\n`);
      } else {
        // Company already exists, fetch it
        const existingCompany = await client.query(
          'SELECT id FROM companies WHERE company_name = $1',
          [companyData.company_name]
        );
        if (existingCompany.rows.length > 0) {
          createdCompanies.push({
            id: existingCompany.rows[0].id,
            userId,
            name: companyData.company_name
          });
          console.log(`ℹ️  Company already exists: ${companyData.company_name}\n`);
        }
      }
    }

    // Create jobs for companies
    console.log('📝 Creating jobs...\n');
    let jobsCreated = 0;

    for (const jobData of jobsData) {
      const company = createdCompanies[jobData.company_index];
      if (!company) {
        console.log(`⚠️  Skipping job: Company index ${jobData.company_index} not found`);
        continue;
      }

      // Set expiry date (30 days from now)
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 30);

      const jobResult = await client.query(
        `INSERT INTO jobs (
          company_id, posted_by, title, description, requirements,
          location, job_type, work_mode, salary, skills, tier, status, expires_at
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
        RETURNING id, title`,
        [
          company.id,
          company.userId,
          jobData.title,
          jobData.description,
          jobData.requirements,
          jobData.location,
          jobData.job_type,
          jobData.work_mode,
          jobData.salary,
          JSON.stringify(jobData.skills),
          jobData.tier,
          'active',
          expiresAt
        ]
      );

      jobsCreated++;
      console.log(`✅ Created job: ${jobData.title} at ${company.name}`);
    }

    await client.query('COMMIT');
    console.log(`\n🎉 Seeding completed successfully!`);
    console.log(`   - Companies created: ${createdCompanies.length}`);
    console.log(`   - Jobs created: ${jobsCreated}`);
    console.log(`\n📧 Employer login credentials:`);
    createdCompanies.forEach((company, index) => {
      console.log(`   ${index + 1}. Email: employer${index + 1}@company.mm | Password: password123`);
    });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Seeding failed:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

// Run seeding
seedDatabase()
  .then(() => {
    console.log('\n✅ Seed script completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Seed script failed:', error);
    process.exit(1);
  });
