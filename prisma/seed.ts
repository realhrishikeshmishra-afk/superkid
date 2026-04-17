import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const categories = [
    { name: 'Fuel Stickers', slug: 'fuel-stickers', icon: '🏍️' },
    { name: 'Devotional', slug: 'devotional', icon: '🛕' },
    { name: 'Professional', slug: 'professional', icon: '💼' },
    { name: 'Awareness', slug: 'awareness', icon: '📢' },
    { name: 'Office Signs', slug: 'office-signs', icon: '🏢' },
    { name: 'Political', slug: 'political', icon: '⚖️' },
  ]

  for (const cat of categories) {
    const category = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: {
        name: cat.name,
        slug: cat.slug,
        icon: cat.icon,
      },
    })

    // Seed products for each category
    const productNames = [
      ['Classic Chrome', 'Spirit of Speed', 'Turbo Power'],
      ['Shree Ganesh', 'Divine Protection', 'Bhakti Decal'],
      ['Executive Suite', 'Strictly Business', 'Pro Badge'],
      ['Save the Oceans', 'Eco Warrior', 'Awareness Ribbons'],
      ['No Smoking', 'Authorized Entry Only', 'Push/Pull Set'],
      ['Vote for Change', 'Unity Badge', 'Freedom First']
    ]

    const catIndex = categories.indexOf(cat)
    const names = productNames[catIndex] || ['Standard Sticker', 'Basic Decal', 'Simple Poster']

    for (let i = 0; i < 4; i++) {
        const name = `${names[i % names.length]} ${i + 1}`
        await prisma.product.upsert({
            where: { slug: `${cat.slug}-prod-${i}` },
            update: {},
            create: {
                name,
                slug: `${cat.slug}-prod-${i}`,
                description: `This is a high-quality ${cat.name} sticker. Durable, waterproof and UV resistant.`,
                price: 29 + (Math.random() * 70),
                salePrice: Math.random() > 0.5 ? 29 + (Math.random() * 30) : null,
                stock: 10 + Math.floor(Math.random() * 90),
                emoji: cat.icon,
                categoryId: category.id,
            }
        })
    }
  }

  console.log('Seed completed successfully')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
