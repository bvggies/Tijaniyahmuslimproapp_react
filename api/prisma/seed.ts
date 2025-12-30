import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...\n');
  console.log('🔒 DATA PROTECTION MODE: All existing user data will be preserved.\n');
  console.log('ℹ️  This script will ONLY create missing demo users.');
  console.log('ℹ️  It will NEVER delete any existing users or data.\n');

  // Create demo users (only if they don't exist)
  console.log('👥 Checking/Creating demo users...');
  
  const demoPassword = await bcrypt.hash('demo123', 10);
  const adminPassword = await bcrypt.hash('admin123', 10);
  const moderatorPassword = await bcrypt.hash('moderator123', 10);

  // Check if demo user exists
  let demoUser = await prisma.user.findUnique({
    where: { email: 'demo@tijaniyah.com' },
  });
  if (!demoUser) {
    demoUser = await prisma.user.create({
      data: {
        email: 'demo@tijaniyah.com',
        passwordHash: demoPassword,
        name: 'Demo User',
        avatarUrl: null,
      },
    });
    console.log(`✅ Created demo user: ${demoUser.email}`);
  } else {
    console.log(`ℹ️  Demo user already exists: ${demoUser.email}`);
  }

  // Check if admin user exists
  let adminUser = await prisma.user.findUnique({
    where: { email: 'admin@tijaniyahpro.com' },
  });
  if (!adminUser) {
    adminUser = await prisma.user.create({
      data: {
        email: 'admin@tijaniyahpro.com',
        passwordHash: adminPassword,
        name: 'Super Administrator',
        avatarUrl: null,
        role: 'ADMIN',
      },
    });
    console.log(`✅ Created admin user: ${adminUser.email}`);
  } else {
    // Ensure admin user has ADMIN role
    if (adminUser.role !== 'ADMIN') {
      adminUser = await prisma.user.update({
        where: { id: adminUser.id },
        data: { role: 'ADMIN' },
      });
      console.log(`✅ Updated admin user role: ${adminUser.email}`);
    } else {
      console.log(`ℹ️  Admin user already exists: ${adminUser.email}`);
    }
  }

  // Check if moderator user exists
  let moderatorUser = await prisma.user.findUnique({
    where: { email: 'moderator@tijaniyahpro.com' },
  });
  if (!moderatorUser) {
    moderatorUser = await prisma.user.create({
      data: {
        email: 'moderator@tijaniyahpro.com',
        passwordHash: moderatorPassword,
        name: 'Content Moderator',
        avatarUrl: null,
        role: 'MODERATOR',
      },
    });
    console.log(`✅ Created moderator user: ${moderatorUser.email}`);
  } else {
    // Ensure moderator user has MODERATOR role
    if (moderatorUser.role !== 'MODERATOR') {
      moderatorUser = await prisma.user.update({
        where: { id: moderatorUser.id },
        data: { role: 'MODERATOR' },
      });
      console.log(`✅ Updated moderator user role: ${moderatorUser.email}`);
    } else {
      console.log(`ℹ️  Moderator user already exists: ${moderatorUser.email}`);
    }
  }

  // Create additional test users (only if they don't exist)
  const testUsers: Array<{ id: string; email: string }> = [];
  for (let i = 1; i <= 5; i++) {
    const email = `user${i}@example.com`;
    let user = await prisma.user.findUnique({
      where: { email },
    });
    if (!user) {
      const password = await bcrypt.hash(`user${i}123`, 10);
      user = await prisma.user.create({
        data: {
          email,
          passwordHash: password,
          name: `Test User ${i}`,
          avatarUrl: null,
        },
      });
      console.log(`✅ Created test user: ${user.email}`);
    } else {
      console.log(`ℹ️  Test user already exists: ${user.email}`);
    }
    testUsers.push(user);
  }
  console.log('✅ All users checked/created\n');

  // Create sample community posts (only if no posts exist)
  console.log('📝 Creating community posts...');
  
  const existingPostsCount = await prisma.communityPost.count();
  if (existingPostsCount > 0) {
    console.log(`ℹ️  ${existingPostsCount} posts already exist. Skipping post creation.\n`);
  } else {
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
  }

  // Create comments on posts (only if no comments exist)
  console.log('💬 Creating comments...');
  
  const existingCommentsCount = await prisma.communityComment.count();
  if (existingCommentsCount > 0) {
    console.log(`ℹ️  ${existingCommentsCount} comments already exist. Skipping comment creation.\n`);
  } else {
    // Get posts for comments (create if needed)
    const posts = await prisma.communityPost.findMany({ take: 5, orderBy: { createdAt: 'desc' } });
    if (posts.length === 0) {
      console.log('⚠️  No posts found. Skipping comment creation.\n');
    } else {
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
          postId: posts[Math.min(2, posts.length - 1)].id,
          userId: demoUser.id,
          content: 'MashaAllah! Keep up the good work.',
        },
        {
          postId: posts[Math.min(4, posts.length - 1)].id,
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
        { postId: posts[Math.min(1, posts.length - 1)].id, userId: demoUser.id },
        { postId: posts[Math.min(1, posts.length - 1)].id, userId: testUsers[0].id },
        { postId: posts[Math.min(2, posts.length - 1)].id, userId: adminUser.id },
        { postId: posts[Math.min(2, posts.length - 1)].id, userId: testUsers[1].id },
      ];

      for (const likeData of likes) {
        await prisma.communityLike.create({
          data: likeData,
        });
        console.log(`✅ Created like on post ${likeData.postId}`);
      }
      console.log('✅ All likes created\n');
    }
  }

  // Create journal entries (only if no entries exist)
  console.log('📔 Creating journal entries...');
  
  const existingJournalCount = await prisma.journalEntry.count();
  if (existingJournalCount > 0) {
    console.log(`ℹ️  ${existingJournalCount} journal entries already exist. Skipping journal creation.\n`);
  } else {
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
  }

  // Create a conversation and messages (only if no conversations exist)
  console.log('💬 Creating conversations and messages...');
  
  let conversationCount = 0;
  let messageCount = 0;
  
  const existingConversationCount = await prisma.conversation.count().catch(() => 0);
  if (existingConversationCount > 0) {
    console.log(`ℹ️  ${existingConversationCount} conversations already exist. Skipping conversation creation.\n`);
  } else {
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
  }

  console.log('🎉 Database seeding completed successfully!\n');
  console.log('📊 Summary:');
  const totalUsers = await prisma.user.count();
  const totalPosts = await prisma.communityPost.count();
  const totalComments = await prisma.communityComment.count();
  const totalLikes = await prisma.communityLike.count();
  const totalJournals = await prisma.journalEntry.count();
  const totalConversations = await prisma.conversation.count().catch(() => 0);
  const totalMessages = await prisma.message.count().catch(() => 0);
  
  console.log(`   - Users: ${totalUsers}`);
  console.log(`   - Posts: ${totalPosts}`);
  console.log(`   - Comments: ${totalComments}`);
  console.log(`   - Likes: ${totalLikes}`);
  console.log(`   - Journal Entries: ${totalJournals}`);
  console.log(`   - Conversations: ${totalConversations}`);
  console.log(`   - Messages: ${totalMessages}\n`);
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

