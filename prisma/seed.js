const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const data = require('../../../test.json');

async function main() {
  const user = await createUser();
  const profile = await createProfile(user);
  const event = await createEvent();
  const thread = await createThread(user);
  const reply = await createReply(user, thread);
  process.exit(0);
}

async function createUser() {
  const createdUser = await prisma.user.create({
    data: {
      username: 'omar2',
      password: '12345',
      email: 'ooo@ooo.com',
    },
  });
  console.log('created user', createdUser);
  return createdUser;
}

async function createProfile(user) {
  const createdProfile = await prisma.profile.create({
    data: {
      firstname: 'omar',
      lastname: 'alsyouf',
      avatarUrl: 'https://avatars.githubusercontent.com/u/59410037?v=4',
      bio: 'something cool',
      phone: '123',
      user: {
        connect: {
          id: user.id,
        },
      },
    },
    include: {
      user: true,
    },
  });
  console.log('profile', createdProfile);
  return createdProfile;
}

async function createEvent() {
  const createdEvent = await prisma.event.createMany({
    data,
  });
  console.log('created event', createdEvent);
  return createdEvent;
}

async function createThread(user) {
  const createdThread = await prisma.thread.create({
    data: {
      title: 'not a thread',
      content: 'this thread is fake',
      user: {
        connect: {
          id: user.id,
        },
      },
    },
    include: {
      user: true,
    },
  });
  console.log('thread created', createdThread);
  return createdThread;
}

async function createReply(user, thread) {
  const createdReply = await prisma.reply.create({
    data: {
      content: 'no solution for this mate',
      user: {
        connect: { id: user.id },
      },
      thread: {
        connect: { id: thread.id },
      },
    },
    include: {
      user: true,
      thread: true,
    },
  });
  console.log('created reply', createdReply);
  return createdReply;
}

main().catch(async (err) => {
  console.log(err);
  await prisma.$disconnect();
  process.exit(1);
});
