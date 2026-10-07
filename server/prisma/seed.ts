import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting PregnaCare AI database seeding...');

  // 1. Clean existing records in proper dependency order
  await prisma.chatMessage.deleteMany({});
  await prisma.chatSession.deleteMany({});
  await prisma.milestone.deleteMany({});
  await prisma.reminder.deleteMany({});
  await prisma.appointment.deleteMany({});
  await prisma.task.deleteMany({});
  await prisma.project.deleteMany({});
  await prisma.pregnancyProfile.deleteMany({});
  await prisma.doctor.deleteMany({});
  await prisma.user.deleteMany({});

  console.log('🧹 Cleaned existing data.');

  // 2. Seed Fictional Healthcare Professionals
  const doctors = await Promise.all([
    prisma.doctor.create({
      data: {
        name: 'Dr. Evelyn Vance, MD',
        specialty: 'Obstetrician / Gynecologist',
        hospitalClinic: 'St. Jude Maternal Wellness Pavilion',
        location: 'Downtown Medical District',
        experience: 14,
        rating: 4.9,
        availability: 'Mon, Wed, Fri (9:00 AM - 4:30 PM)',
        profileImage: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300',
        about: 'Board-certified OB/GYN with 14+ years of compassionate clinical care focusing on holistic maternal health, physiological birth guidance, and prenatal screening.',
      },
    }),
    prisma.doctor.create({
      data: {
        name: 'Dr. Marcus Sterling, MD',
        specialty: 'Maternal-Fetal Medicine Specialist',
        hospitalClinic: 'University Perinatal Institute',
        location: 'Westside Academic Health Center',
        experience: 18,
        rating: 4.8,
        availability: 'Tue, Thu (8:30 AM - 3:00 PM)',
        profileImage: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=300',
        about: 'Specializing in advanced ultrasound diagnostics, high-risk pregnancy management, gestational monitoring, and maternal cardio-metabolic health.',
      },
    }),
    prisma.doctor.create({
      data: {
        name: 'Elena Rostova, MS, RDN',
        specialty: 'Prenatal Nutritionist',
        hospitalClinic: 'Nurture Maternal Nutrition Center',
        location: 'Northside Health Plaza',
        experience: 9,
        rating: 4.9,
        availability: 'Mon, Tue, Thu (10:00 AM - 6:00 PM)',
        profileImage: 'https://images.unsplash.com/photo-1594824813587-0b1a030d0752?auto=format&fit=crop&q=80&w=300',
        about: 'Clinical dietitian dedicated to evidence-based gestational diabetes nutrition, micronutrient balancing, plant-focused prenatal diets, and morning sickness relief.',
      },
    }),
    prisma.doctor.create({
      data: {
        name: 'Hannah Brooks, IBCLC',
        specialty: 'Lactation Consultant',
        hospitalClinic: 'Bloomsbury Family Support Center',
        location: 'Midtown Care Suite',
        experience: 11,
        rating: 5.0,
        availability: 'Wed, Fri, Sat (9:00 AM - 2:00 PM)',
        profileImage: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&q=80&w=300',
        about: 'International Board Certified Lactation Consultant empowering new and expecting parents with feeding techniques, flange sizing, latch optimization, and newborn bonding.',
      },
    }),
    prisma.doctor.create({
      data: {
        name: 'Dr. Julian Thorne, PsyD',
        specialty: 'Perinatal Mental Health Specialist',
        hospitalClinic: 'Calm Minds Perinatal Therapy',
        location: 'Greenwood Wellness Hub',
        experience: 12,
        rating: 4.8,
        availability: 'Mon - Thu (11:00 AM - 5:00 PM)',
        profileImage: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=300',
        about: 'Specialized clinical psychologist supporting mothers through prenatal anxiety, birth trauma prevention, hormonal mood adjustments, and postpartum mental health.',
      },
    }),
  ]);

  console.log(`👨‍⚕️ Seeded ${doctors.length} doctors.`);

  // 3. Password hash for test users
  const passwordHash = await bcrypt.hash('Password123!', 10);

  // 4. User 1: Sarah Jenkins (Week 24 - Second Trimester)
  const user1 = await prisma.user.create({
    data: {
      fullName: 'Sarah Jenkins',
      email: 'demo@pregnacare.com',
      passwordHash,
    },
  });

  const due1 = new Date();
  due1.setDate(due1.getDate() + 112); // ~16 weeks remaining

  await prisma.pregnancyProfile.create({
    data: {
      userId: user1.id,
      dueDate: due1,
      currentWeek: 24,
      startDate: new Date(Date.now() - 24 * 7 * 24 * 60 * 60 * 1000),
      preferredDoctor: 'Dr. Evelyn Vance, MD',
      notes: 'Baby girl actively kicking! Blood pressure stable. Taking daily prenatal vitamin with DHA.',
    },
  });

  // Projects for Sarah
  const proj1 = await prisma.project.create({
    data: {
      userId: user1.id,
      name: 'Hospital Preparation',
      description: 'Selecting delivery facility, finalizing birth preferences, and packing hospital bags.',
      status: 'IN_PROGRESS',
      startDate: new Date(),
      endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
    },
  });

  const proj2 = await prisma.project.create({
    data: {
      userId: user1.id,
      name: 'Baby Essentials Planning',
      description: 'Nursery setup, safe crib certification, car seat installation, and feeding equipment.',
      status: 'NOT_STARTED',
      startDate: new Date(),
    },
  });

  const proj3 = await prisma.project.create({
    data: {
      userId: user1.id,
      name: 'First Trimester Preparation',
      description: 'Initial clinic screenings, ultrasound scans, and morning sickness mitigation.',
      status: 'COMPLETED',
      startDate: new Date(Date.now() - 100 * 24 * 60 * 60 * 1000),
      endDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    },
  });

  // Tasks for Sarah
  await prisma.task.createMany({
    data: [
      {
        userId: user1.id,
        projectId: proj1.id,
        name: 'Choose hospital and schedule maternity tour',
        description: 'Tour St. Jude Pavilion maternity suites and compare neonatal facilities.',
        priority: 'HIGH',
        status: 'COMPLETED',
        dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      },
      {
        userId: user1.id,
        projectId: proj1.id,
        name: 'Prepare hospital bag essentials checklist',
        description: 'Pack comfortable clothes, toiletries, infant going-home outfit, and nursing gear.',
        priority: 'HIGH',
        status: 'IN_PROGRESS',
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      },
      {
        userId: user1.id,
        projectId: proj1.id,
        name: 'Prepare medical identification and insurance cards',
        description: 'Have copies of pre-authorization forms and emergency contacts ready.',
        priority: 'MEDIUM',
        status: 'PENDING',
        dueDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
      },
      {
        userId: user1.id,
        projectId: proj2.id,
        name: 'Research rear-facing infant car seat',
        description: 'Check NHTSA safety ratings and schedule inspection with certified technician.',
        priority: 'HIGH',
        status: 'PENDING',
        dueDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
      },
      {
        userId: user1.id,
        projectId: proj3.id,
        name: 'Complete first trimester blood tests & nuchal scan',
        description: 'Standard genetic carrier and developmental screening.',
        priority: 'HIGH',
        status: 'COMPLETED',
      },
    ],
  });

  // Appointments for Sarah
  const apptDate1 = new Date();
  apptDate1.setDate(apptDate1.getDate() + 5);

  await prisma.appointment.create({
    data: {
      userId: user1.id,
      doctorId: doctors[0].id,
      appointmentDate: apptDate1,
      appointmentTime: '10:30 AM',
      appointmentType: 'Routine Prenatal Consultation (Week 24)',
      notes: 'Check fundal height, blood pressure, and review glucose challenge test scheduling.',
      status: 'UPCOMING',
    },
  });

  const apptDate2 = new Date();
  apptDate2.setDate(apptDate2.getDate() - 28);
  await prisma.appointment.create({
    data: {
      userId: user1.id,
      doctorId: doctors[1].id,
      appointmentDate: apptDate2,
      appointmentTime: '02:00 PM',
      appointmentType: 'Mid-Pregnancy Anatomy Ultrasound',
      notes: 'All biometric parameters within typical developmental percentiles.',
      status: 'COMPLETED',
    },
  });

  // Milestones for Sarah
  await prisma.milestone.createMany({
    data: [
      { userId: user1.id, title: 'Pregnancy Confirmation', description: 'Confirmed with clinic', targetWeek: 4, isCompleted: true },
      { userId: user1.id, title: 'First Prenatal Care Visit', description: 'Routine baseline tests', targetWeek: 8, isCompleted: true },
      { userId: user1.id, title: 'First Trimester Completed', description: 'Entering week 14', targetWeek: 13, isCompleted: true },
      { userId: user1.id, title: 'Mid-Pregnancy Anatomy Scan', description: 'Detailed scan', targetWeek: 20, isCompleted: true },
      { userId: user1.id, title: 'Fetal Movement First Felt', description: 'Quickening noticed', targetWeek: 22, isCompleted: true },
      { userId: user1.id, title: 'Second Trimester Completed', description: 'Week 27 milestone', targetWeek: 27, isCompleted: false },
      { userId: user1.id, title: 'Hospital Selection', description: 'Tour chosen hospital', targetWeek: 32, isCompleted: false },
      { userId: user1.id, title: 'Hospital Bag Packed', description: 'Ready for delivery', targetWeek: 36, isCompleted: false },
    ],
  });

  // Reminders for Sarah
  await prisma.reminder.createMany({
    data: [
      { userId: user1.id, title: 'Take prenatal vitamin with breakfast', reminderType: 'DAILY_WELLNESS', reminderDate: new Date() },
      { userId: user1.id, title: 'Drink 2.5L water throughout day', reminderType: 'HYDRATION', reminderDate: new Date() },
      { userId: user1.id, title: 'Discuss birth plan with Dr. Vance', reminderType: 'APPOINTMENT', reminderDate: apptDate1 },
    ],
  });

  // 5. User 2: Emily Watson (Week 10 - First Trimester)
  const user2 = await prisma.user.create({
    data: {
      fullName: 'Emily Watson',
      email: 'emily@pregnacare.com',
      passwordHash,
    },
  });

  const due2 = new Date();
  due2.setDate(due2.getDate() + 210);

  await prisma.pregnancyProfile.create({
    data: {
      userId: user2.id,
      dueDate: due2,
      currentWeek: 10,
      preferredDoctor: 'Dr. Evelyn Vance, MD',
      notes: 'Mild morning nausea. Focusing on smaller frequent meals and rest.',
    },
  });

  const projEmily = await prisma.project.create({
    data: {
      userId: user2.id,
      name: 'First Trimester Wellness',
      description: 'Managing early symptoms and scheduling baseline screenings.',
      status: 'IN_PROGRESS',
    },
  });

  await prisma.task.create({
    data: {
      userId: user2.id,
      projectId: projEmily.id,
      name: 'Schedule nuchal translucency scan',
      priority: 'HIGH',
      status: 'IN_PROGRESS',
      dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
    },
  });

  // 6. User 3: Olivia Chen (Week 34 - Third Trimester)
  const user3 = await prisma.user.create({
    data: {
      fullName: 'Olivia Chen',
      email: 'olivia@pregnacare.com',
      passwordHash,
    },
  });

  const due3 = new Date();
  due3.setDate(due3.getDate() + 42);

  await prisma.pregnancyProfile.create({
    data: {
      userId: user3.id,
      dueDate: due3,
      currentWeek: 34,
      preferredDoctor: 'Dr. Marcus Sterling, MD',
      notes: 'Baby in cephalic position. Preparing birth preferences and car seat.',
    },
  });

  const projOlivia = await prisma.project.create({
    data: {
      userId: user3.id,
      name: 'Birth & Postnatal Readiness',
      description: 'Finalizing infant nursery and hospital packing.',
      status: 'IN_PROGRESS',
    },
  });

  await prisma.task.create({
    data: {
      userId: user3.id,
      projectId: projOlivia.id,
      name: 'Install car seat in vehicle',
      priority: 'HIGH',
      status: 'PENDING',
    },
  });

  console.log('✅ Successfully seeded 3 demo users, profiles, projects, tasks, and appointments!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
