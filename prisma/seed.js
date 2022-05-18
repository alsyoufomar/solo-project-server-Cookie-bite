const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const data = require('../../../test.json')


async function main () {
  // const user = await createUser();
  // const profile = await createProfile(user)
  const event = await createEvent()
  // const booking = await createBooking(user)
  // const ticket = await createTicket(user, booking)
  process.exit(0);
}


async function createUser () {
  const createdUser = await prisma.user.create({
    data: {
      username: 'omar2',
      password: '12345'
    }
  })
  console.log('created user', createdUser)
  return createdUser
}

async function createProfile (user) {
  const createdProfile = await prisma.profile.create({
    data: {
      firstname: 'omar',
      lastname: 'alsyouf',
      email: '123@12345.com',
      phone: '123',
      image: 'https://avatars.githubusercontent.com/u/59410037?v=4',
      address: 'se23jw',
      user: {
        connect: {
          id: user.id
        }
      }
    },
    include: {
      user: true

    }
  })
  console.log('profile', createdProfile)
  return createdProfile
}

async function createEvent () {
  const createdEvent = await prisma.event.createMany({
    data
  })
  console.log('created event', createdEvent)
  return createdEvent
}

async function createBooking (user) {
  const createdBooking = await prisma.booking.create({
    data: {
      price: 30.5,
      user: {
        connect: {
          id: user.id
        }
      }
    },
    include: {
      user: true
    }
  })
  console.log('booking created', createdBooking)
  return createdBooking
}

async function createTicket (user, booking) {
  const createdTicket = await prisma.ticket.create({
    data: {
      eventDate: 'tomorrow',
      eventLocation: 'London, England',
      user: {
        connect: { id: user.id }
      },
      event: {
        connect: { id: 3 }
      },
      booking: {
        connect: { id: booking.id }
      }
    },
    include: {
      user: true,
      event: true,
      booking: true
    }
  })
  console.log('created ticket', createdTicket)
  return createdTicket
}

main()
  .catch(async err => {
    console.log(err)
    await prisma.$disconnect()
    process.exit(1)
  })



