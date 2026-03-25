const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Inline models to keep seed self-contained
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: String,
}, { timestamps: true });

const bugSchema = new mongoose.Schema({
  title: String,
  description: String,
  priority: String,
  severity: String,
  status: String,
  reportedBy: mongoose.Schema.Types.ObjectId,
  reportedByName: String,
  assignedTo: { type: mongoose.Schema.Types.ObjectId, default: null },
  assignedToName: { type: String, default: null },
  environment: String,
  stepsToReproduce: String,
  comments: [],
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
const Bug = mongoose.model('Bug', bugSchema);

const seed = async () => {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/bugtracker');
  console.log('Connected to MongoDB...');

  // Clear existing
  await User.deleteMany({});
  await Bug.deleteMany({});

  // Create users
  const hashedPw = await bcrypt.hash('demo123', 12);
  const [admin, dev1, dev2, tester] = await User.insertMany([
    { name: 'Guru Priya', email: 'gp@demo.com', password: hashedPw, role: 'admin' },
    { name: 'Nithiyashree', email: 'ns@demo.com', password: hashedPw, role: 'developer' },
    { name: 'Jaswini', email: 'jd@demo.com', password: hashedPw, role: 'developer' },
    { name: 'Priya', email: 'pd@demo.com', password: hashedPw, role: 'tester' },
  ]);

  console.log('✅ Users created');

  // Create sample bugs
  await Bug.insertMany([
    {
      title: 'Login page crashes on mobile Safari',
      description: 'When users try to log in on iPhone with Safari browser, the page crashes after entering password.',
      priority: 'critical',
      severity: 'blocker',
      status: 'in_progress',
      reportedBy: tester._id,
      reportedByName: tester.name,
      assignedTo: dev1._id,
      assignedToName: dev1.name,
      environment: 'iOS 16, Safari 16',
      stepsToReproduce: '1. Open app on iPhone\n2. Enter credentials\n3. Tap Login\n4. App crashes',
    },
    {
      title: 'Dashboard stats showing incorrect count',
      description: 'The "Open Bugs" count on the dashboard shows a number that doesn\'t match the actual filtered view.',
      priority: 'high',
      severity: 'major',
      status: 'assigned',
      reportedBy: tester._id,
      reportedByName: tester.name,
      assignedTo: dev2._id,
      assignedToName: dev2.name,
      environment: 'Chrome 115, Windows 11',
      stepsToReproduce: '1. Go to Dashboard\n2. Note "Open Bugs" count\n3. Navigate to Bugs page\n4. Filter by open status\n5. Count differs',
    },
    {
      title: 'File upload fails for files > 5MB',
      description: 'Users cannot upload files larger than 5MB. The upload hangs indefinitely without any error message.',
      priority: 'high',
      severity: 'major',
      status: 'new',
      reportedBy: tester._id,
      reportedByName: tester.name,
      environment: 'Firefox 115, macOS Ventura',
    },
    {
      title: 'Search autocomplete delays by 5 seconds',
      description: 'The search autocomplete dropdown appears with a noticeable 5-second delay, making it unusable.',
      priority: 'medium',
      severity: 'minor',
      status: 'resolved',
      reportedBy: tester._id,
      reportedByName: tester.name,
      assignedTo: dev1._id,
      assignedToName: dev1.name,
      environment: 'Chrome 115, Windows 10',
    },
    {
      title: 'Email notifications not sending',
      description: 'Users report not receiving any email notifications for bug assignments or status changes.',
      priority: 'high',
      severity: 'major',
      status: 'in_progress',
      reportedBy: admin._id,
      reportedByName: admin.name,
      assignedTo: dev2._id,
      assignedToName: dev2.name,
      environment: 'Production',
    },
    {
      title: 'Dark mode toggle resets on page refresh',
      description: 'The dark mode preference is not persisted. Every time the page is refreshed, it reverts to light mode.',
      priority: 'low',
      severity: 'minor',
      status: 'new',
      reportedBy: tester._id,
      reportedByName: tester.name,
      environment: 'All browsers',
    },
    {
      title: 'Pagination breaks at > 100 items',
      description: 'When the bug list exceeds 100 items, the pagination component stops working correctly.',
      priority: 'medium',
      severity: 'major',
      status: 'closed',
      reportedBy: dev1._id,
      reportedByName: dev1.name,
      assignedTo: dev2._id,
      assignedToName: dev2.name,
      environment: 'Chrome 115',
    },
    {
      title: 'XSS vulnerability in comment field',
      description: 'The comment input field does not sanitize HTML input, allowing script injection.',
      priority: 'critical',
      severity: 'critical',
      status: 'assigned',
      reportedBy: admin._id,
      reportedByName: admin.name,
      assignedTo: dev1._id,
      assignedToName: dev1.name,
      environment: 'All environments',
      stepsToReproduce: '1. Open any bug\n2. Enter <script>alert(1)</script> in comment\n3. Submit\n4. Script executes',
    },
  ]);

  console.log('✅ Sample bugs created');
  console.log('\n🎉 Seed complete! Demo credentials:');
  console.log('  Admin:     admin@demo.com  / demo123');
  console.log('  Developer: dev@demo.com    / demo123');
  console.log('  Tester:    tester@demo.com / demo123');

  await mongoose.disconnect();
  process.exit(0);
};

seed().catch((err) => {
  console.error('Seed error:', err);
  process.exit(1);
});
