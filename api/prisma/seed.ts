import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...\n');

  // Clear existing data (optional - comment out if you want to keep existing data)
  console.log('🧹 Cleaning existing data...');
  try {
    await prisma.message.deleteMany();
  } catch (e) {
    console.log('⚠️  Message table does not exist, skipping...');
  }
  try {
    await prisma.conversation.deleteMany();
  } catch (e) {
    console.log('⚠️  Conversation table does not exist, skipping...');
  }
  await prisma.journalEntry.deleteMany();
  await prisma.communityLike.deleteMany();
  await prisma.communityComment.deleteMany();
  await prisma.communityPost.deleteMany();
  await prisma.user.deleteMany();
  console.log('✅ Existing data cleaned\n');

  // Create demo users
  console.log('👥 Creating users...');
  
  const demoPassword = await bcrypt.hash('demo123', 10);
  const adminPassword = await bcrypt.hash('admin123', 10);
  const moderatorPassword = await bcrypt.hash('moderator123', 10);

  const demoUser = await prisma.user.create({
    data: {
      email: 'demo@tijaniyah.com',
      passwordHash: demoPassword,
      name: 'Demo User',
      avatarUrl: null,
    },
  });
  console.log(`✅ Created demo user: ${demoUser.email}`);

  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@tijaniyahpro.com',
      passwordHash: adminPassword,
      name: 'Super Administrator',
      avatarUrl: null,
    },
  });
  console.log(`✅ Created admin user: ${adminUser.email}`);

  const moderatorUser = await prisma.user.create({
    data: {
      email: 'moderator@tijaniyahpro.com',
      passwordHash: moderatorPassword,
      name: 'Content Moderator',
      avatarUrl: null,
    },
  });
  console.log(`✅ Created moderator user: ${moderatorUser.email}`);

  // Create additional test users
  const testUsers: Array<{ id: string; email: string }> = [];
  for (let i = 1; i <= 5; i++) {
    const password = await bcrypt.hash(`user${i}123`, 10);
    const user = await prisma.user.create({
      data: {
        email: `user${i}@example.com`,
        passwordHash: password,
        name: `Test User ${i}`,
        avatarUrl: null,
      },
    });
    testUsers.push(user);
    console.log(`✅ Created test user: ${user.email}`);
  }
  console.log('✅ All users created\n');

  // Create sample community posts
  console.log('📝 Creating community posts...');
  
  const samplePosts: Array<{ userId: string; content: string }> = [
    {
      userId: demoUser.id,
      content: 'Assalamu Alaikum! Welcome to the Tijaniyah community. May Allah bless us all on this spiritual journey. 🌙',
    },
    {
      userId: adminUser.id,
      content: 'Reminder: Daily dhikr and prayer times are essential for our spiritual growth. Let us support each other in maintaining our practices.',
    },
    {
      userId: testUsers[0].id,
      content: 'Just completed my morning wazifa. Feeling blessed and grateful. Alhamdulillah! 🙏',
    },
    {
      userId: testUsers[1].id,
      content: 'The beauty of Tariqa Tijaniyyah lies in its simplicity and devotion. May we all find peace in our hearts.',
    },
    {
      userId: testUsers[2].id,
      content: 'Question: What are the best resources for beginners learning about Tijaniyah? Any recommendations?',
    },
  ];

  const posts: Array<{ id: string; content: string }> = [];
  for (const postData of samplePosts) {
    const post = await prisma.communityPost.create({
      data: postData,
    });
    posts.push(post);
    console.log(`✅ Created post: "${post.content.substring(0, 50)}..."`);
  }
  console.log('✅ All posts created\n');

  // Create comments on posts
  console.log('💬 Creating comments...');
  
  const comments: Array<{ postId: string; userId: string; content: string }> = [
    {
      postId: posts[0].id,
      userId: testUsers[0].id,
      content: 'Wa Alaikum Assalam! Great to be here.',
    },
    {
      postId: posts[0].id,
      userId: testUsers[1].id,
      content: 'Welcome! Looking forward to learning together.',
    },
    {
      postId: posts[2].id,
      userId: demoUser.id,
      content: 'MashaAllah! Keep up the good work.',
    },
    {
      postId: posts[4].id,
      userId: adminUser.id,
      content: 'I recommend starting with the basic texts available in the app. Check the Resources section!',
    },
  ];

  for (const commentData of comments) {
    await prisma.communityComment.create({
      data: commentData,
    });
    console.log(`✅ Created comment on post ${commentData.postId}`);
  }
  console.log('✅ All comments created\n');

  // Create likes
  console.log('❤️  Creating likes...');
  
  const likes: Array<{ postId: string; userId: string }> = [
    { postId: posts[0].id, userId: testUsers[0].id },
    { postId: posts[0].id, userId: testUsers[1].id },
    { postId: posts[0].id, userId: testUsers[2].id },
    { postId: posts[1].id, userId: demoUser.id },
    { postId: posts[1].id, userId: testUsers[0].id },
    { postId: posts[2].id, userId: adminUser.id },
    { postId: posts[2].id, userId: testUsers[1].id },
  ];

  for (const likeData of likes) {
    await prisma.communityLike.create({
      data: likeData,
    });
    console.log(`✅ Created like on post ${likeData.postId}`);
  }
  console.log('✅ All likes created\n');

  // Create journal entries
  console.log('📔 Creating journal entries...');
  
  const journalEntries: Array<{ userId: string; title: string; content: string; tags: string[] }> = [
    {
      userId: demoUser.id,
      title: 'First Day of Spiritual Journey',
      content: 'Today I started my journey with Tijaniyah. I feel blessed and grateful for this opportunity to grow spiritually.',
      tags: ['spiritual', 'journey', 'gratitude'],
    },
    {
      userId: demoUser.id,
      title: 'Reflection on Daily Practice',
      content: 'Consistency in dhikr and prayer has brought peace to my heart. I am learning to be more patient and grateful.',
      tags: ['reflection', 'practice', 'peace'],
    },
    {
      userId: testUsers[0].id,
      title: 'Learning About Tariqa',
      content: 'The teachings of Tariqa Tijaniyyah are profound yet simple. Each day brings new understanding.',
      tags: ['learning', 'tariqa', 'understanding'],
    },
  ];

  for (const entryData of journalEntries) {
    await prisma.journalEntry.create({
      data: entryData,
    });
    console.log(`✅ Created journal entry: "${entryData.title}"`);
  }
  console.log('✅ All journal entries created\n');

  // Create a conversation and messages (if tables exist)
  console.log('💬 Creating conversations and messages...');
  
  let conversationCount = 0;
  let messageCount = 0;
  
  try {
    const conversation = await prisma.conversation.create({
      data: {
        participants: {
          connect: [
            { id: demoUser.id },
            { id: adminUser.id },
          ],
        },
      },
    });
    console.log(`✅ Created conversation: ${conversation.id}`);
    conversationCount = 1;

    const messages: Array<{ conversationId: string; senderId: string; content: string; messageType: string }> = [
      {
        conversationId: conversation.id,
        senderId: demoUser.id,
        content: 'Assalamu Alaikum! I have a question about the daily practices.',
        messageType: 'text',
      },
      {
        conversationId: conversation.id,
        senderId: adminUser.id,
        content: 'Wa Alaikum Assalam! I would be happy to help. What would you like to know?',
        messageType: 'text',
      },
      {
        conversationId: conversation.id,
        senderId: demoUser.id,
        content: 'Thank you! I wanted to know about the best time to perform the wazifa.',
        messageType: 'text',
      },
    ];

    for (const messageData of messages) {
      await prisma.message.create({
        data: messageData,
      });
      console.log(`✅ Created message in conversation ${messageData.conversationId}`);
      messageCount++;
    }
    console.log('✅ All messages created\n');
  } catch (e: any) {
    console.log('⚠️  Conversation/Message tables do not exist, skipping chat data...\n');
  }

  console.log('🎉 Database seeding completed successfully!\n');
  console.log('📊 Summary:');
  console.log(`   - Users: 8 (demo, admin, moderator, 5 test users)`);
  console.log(`   - Posts: ${posts.length}`);
  console.log(`   - Comments: ${comments.length}`);
  console.log(`   - Likes: ${likes.length}`);
  console.log(`   - Journal Entries: ${journalEntries.length}`);
  console.log(`   - Conversations: ${conversationCount}`);
  console.log(`   - Messages: ${messageCount}\n`);
  console.log('🔐 Login Credentials:');
  console.log('   - Demo: demo@tijaniyah.com / demo123');
  console.log('   - Admin: admin@tijaniyahpro.com / admin123');
  console.log('   - Moderator: moderator@tijaniyahpro.com / moderator123');
  console.log('   - Test Users: user1@example.com / user1123 (user2@example.com / user2123, etc.)\n');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

