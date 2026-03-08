import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Limpando banco...');
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.stock.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();
  await prisma.settings.deleteMany();

  console.log('Criando admin...');
  const adminPassword = await bcrypt.hash('admin123', 10);
  await prisma.user.create({
    data: {
      email: 'admin@podgorillas.com.br',
      password: adminPassword,
      name: 'Admin Gorillas',
      role: 'admin',
      phone: '16999999999',
      lgpdAccepted: true,
    },
  });

  console.log('Criando categorias...');
  const catPods = await prisma.category.create({
    data: { name: 'PODs Descartáveis', slug: 'pods', order: 1 },
  });

  console.log('Criando produtos com imagens reais...');

  // V400 Mix - R$135
  const v400mix = await prisma.product.create({
    data: {
      name: 'V400 Mix',
      slug: 'v400-mix',
      description: 'POD descartável V400 Mix com sabores intensos e refrescantes. Design compacto, ideal para o dia a dia.',
      price: 135.00,
      puffs: 400,
      images: JSON.stringify({
        default: '/products/v400-mix.png',
        'Banana Ice': '/products/v400-mix.png',
        'Strawberry Ice': '/products/v400-mix.png',
      }),
      flavors: JSON.stringify(['Banana Ice', 'Strawberry Ice']),
      categoryId: catPods.id,
      featured: false,
    },
  });

  // V400 - R$120
  const v400 = await prisma.product.create({
    data: {
      name: 'V400',
      slug: 'v400',
      description: 'POD descartável V400 clássico. Sabores tradicionais com vapor suave e consistente.',
      price: 120.00,
      puffs: 400,
      images: JSON.stringify({
        default: '/products/v400-grape.jpg',
        'Grape': '/products/v400-grape.jpg',
        'Menthol': '/products/v400-menthol.jpg',
        'Mint': '/products/v400-mint.jpg',
      }),
      flavors: JSON.stringify(['Grape', 'Menthol', 'Mint']),
      categoryId: catPods.id,
      featured: false,
    },
  });

  // V300 - R$125
  const v300 = await prisma.product.create({
    data: {
      name: 'V300',
      slug: 'v300',
      description: 'POD descartável V300 compacto. Perfeito para iniciantes, sabores frutados refrescantes.',
      price: 125.00,
      puffs: 300,
      images: JSON.stringify({
        default: '/products/v300.jpeg',
        'Cactus Lime Soda': '/products/v300.jpeg',
        'Banana Ice': '/products/v300.jpeg',
        'Strawberry Banana': '/products/v300.jpeg',
      }),
      flavors: JSON.stringify(['Cactus Lime Soda', 'Banana Ice', 'Strawberry Banana']),
      categoryId: catPods.id,
      featured: false,
    },
  });

  // V155 - R$100
  const v155 = await prisma.product.create({
    data: {
      name: 'V155',
      slug: 'v155',
      description: 'POD descartável V155 ultra compacto. O mais portátil da linha, cabe no bolso.',
      price: 100.00,
      puffs: 155,
      images: JSON.stringify({
        default: '/products/v155.png',
        'Strawberry Watermelon': '/products/v155.png',
        'Icy Mint': '/products/v155.png',
        'Menthol': '/products/v155.png',
      }),
      flavors: JSON.stringify(['Strawberry Watermelon', 'Icy Mint', 'Menthol']),
      categoryId: catPods.id,
      featured: false,
    },
  });

  // Elfbar GH 23K - R$105
  const elfbarGH = await prisma.product.create({
    data: {
      name: 'Elfbar GH 23K',
      slug: 'elfbar-gh-23k',
      description: 'ELFBAR GH23000 - Premium disposable com 23000 puffs. Triple Mesh Coil, tela digital, bateria 850mAh recarregável. 3 modos: Lite, Smooth e Turbo.',
      price: 105.00,
      puffs: 23000,
      images: JSON.stringify({
        default: '/products/elfbar-gh-sakura-grape.webp',
        'Sakura Grape': '/products/elfbar-gh-sakura-grape.webp',
        'Strawberry Banana': '/products/elfbar-gh-strawberry-banana.webp',
        'Spring Mint': '/products/elfbar-gh-spring-mint.webp',
        'Lime Grape Fruit': '/products/elfbar-gh-spring-mint.webp',
      }),
      flavors: JSON.stringify(['Sakura Grape', 'Strawberry Banana', 'Spring Mint', 'Lime Grape Fruit']),
      categoryId: catPods.id,
      featured: true,
    },
  });

  // Elfbar TE 30K - R$120
  const elfbarTE = await prisma.product.create({
    data: {
      name: 'Elfbar TE 30K',
      slug: 'elfbar-te-30k',
      description: 'ELFBAR TE30000 - O topo da linha com 30000 puffs. Display intuitivo, bateria 700mAh, carregamento Type-C. Vapor rico e sabor intenso.',
      price: 120.00,
      puffs: 30000,
      images: JSON.stringify({
        default: '/products/elfbar-te-guava-kiwi.webp',
        'Guava Kiwi Passion Fruit': '/products/elfbar-te-guava-kiwi.webp',
        'Bubballo Tuti Fruti': '/products/elfbar-te-bubballo.webp',
        'Cherry Strazz': '/products/elfbar-te-cherry-strazz.webp',
        'Dragon Strawnana': '/products/elfbar-te-cherry-strazz.webp',
      }),
      flavors: JSON.stringify(['Guava Kiwi Passion Fruit', 'Bubballo Tuti Fruti', 'Cherry Strazz', 'Dragon Strawnana']),
      categoryId: catPods.id,
      featured: true,
    },
  });

  // Elfbar Ice King 40K - R$123
  const elfbarIceKing = await prisma.product.create({
    data: {
      name: 'Elfbar Ice King 40K',
      slug: 'elfbar-ice-king-40k',
      description: 'ELFBAR Ice King 40000 - O rei do gelo! 40000 puffs, 5 níveis de cooling, 3 intensidades de vapor. Bateria 850mAh, 25ml e-liquid, Mesh Coil 1.2Ω.',
      price: 123.00,
      puffs: 40000,
      images: JSON.stringify({
        default: '/products/elfbar-ice-king-baja-splash.webp',
        'Baja Splash': '/products/elfbar-ice-king-baja-splash.webp',
        'Summer Splash': '/products/elfbar-ice-king-summer-splash.webp',
        'Dragon Strawnana': '/products/elfbar-ice-king-dragon-strawnana.webp',
      }),
      flavors: JSON.stringify(['Baja Splash', 'Summer Splash', 'Dragon Strawnana']),
      categoryId: catPods.id,
      featured: true,
    },
  });

  // Elfbar Trio 40K - R$120
  const elfbarTrio = await prisma.product.create({
    data: {
      name: 'Elfbar Trio 40K',
      slug: 'elfbar-trio-40k',
      description: 'ELFBAR Trio 40000 - Sistema triplo de ajuste: 4 níveis de Ice, 4 de Sour, 4 de Sweet. Quad Mesh Coil (4 coils), display digital, Type-C fast charging.',
      price: 120.00,
      puffs: 40000,
      images: JSON.stringify({
        default: '/products/elfbar-ice-king-dragon-strawnana.webp',
        'Scary Berry': '/products/elfbar-ice-king-dragon-strawnana.webp',
      }),
      flavors: JSON.stringify(['Scary Berry']),
      categoryId: catPods.id,
      featured: true,
    },
  });

  // Oxbar Kit 32K - R$100
  const oxbarKit = await prisma.product.create({
    data: {
      name: 'Oxbar SVOPP 32K',
      slug: 'oxbar-svopp-32k',
      description: 'OXBAR SVOPP 32K - Sistema de pods recarregáveis. 32000 puffs (Normal) / 16000 (Boost). Bateria 1100mAh, 20ml, Dual Mesh Coil. Ajuste de wattage 11W-30W.',
      price: 100.00,
      puffs: 32000,
      images: JSON.stringify({
        default: '/products/oxbar-grape-paradise.jpg',
        'Grape Paradise': '/products/oxbar-grape-paradise.jpg',
        'Strawberry Banana Ice': '/products/oxbar-strawberry-banana.webp',
      }),
      flavors: JSON.stringify(['Grape Paradise', 'Strawberry Banana Ice']),
      categoryId: catPods.id,
      featured: true,
    },
  });

  console.log('Criando estoque conforme especificado...');

  // V400 Mix: Banana Ice 2x, Strawberry Ice 2x
  await prisma.stock.createMany({
    data: [
      { productId: v400mix.id, flavor: 'Banana Ice', quantity: 2 },
      { productId: v400mix.id, flavor: 'Strawberry Ice', quantity: 2 },
    ],
  });

  // V400: Grape 1x, Menthol 2x, Mint 1x
  await prisma.stock.createMany({
    data: [
      { productId: v400.id, flavor: 'Grape', quantity: 1 },
      { productId: v400.id, flavor: 'Menthol', quantity: 2 },
      { productId: v400.id, flavor: 'Mint', quantity: 1 },
    ],
  });

  // V300: Cactus Lime Soda 2x, Banana Ice 1x, Strawberry Banana 1x
  await prisma.stock.createMany({
    data: [
      { productId: v300.id, flavor: 'Cactus Lime Soda', quantity: 2 },
      { productId: v300.id, flavor: 'Banana Ice', quantity: 1 },
      { productId: v300.id, flavor: 'Strawberry Banana', quantity: 1 },
    ],
  });

  // V155: Strawberry Watermelon 2x, Icy Mint 1x, Menthol 1x
  await prisma.stock.createMany({
    data: [
      { productId: v155.id, flavor: 'Strawberry Watermelon', quantity: 2 },
      { productId: v155.id, flavor: 'Icy Mint', quantity: 1 },
      { productId: v155.id, flavor: 'Menthol', quantity: 1 },
    ],
  });

  // Elfbar GH 23K: Sakura Grape 2x, Strawberry Banana 2x, Spring Mint 2x, Lime Grape Fruit 2x
  await prisma.stock.createMany({
    data: [
      { productId: elfbarGH.id, flavor: 'Sakura Grape', quantity: 2 },
      { productId: elfbarGH.id, flavor: 'Strawberry Banana', quantity: 2 },
      { productId: elfbarGH.id, flavor: 'Spring Mint', quantity: 2 },
      { productId: elfbarGH.id, flavor: 'Lime Grape Fruit', quantity: 2 },
    ],
  });

  // Elfbar TE 30K: Guava Kiwi 1x, Bubballo Tuti 1x, Cherry Strazz 1x, Dragon Strawnana 1x
  await prisma.stock.createMany({
    data: [
      { productId: elfbarTE.id, flavor: 'Guava Kiwi Passion Fruit', quantity: 1 },
      { productId: elfbarTE.id, flavor: 'Bubballo Tuti Fruti', quantity: 1 },
      { productId: elfbarTE.id, flavor: 'Cherry Strazz', quantity: 1 },
      { productId: elfbarTE.id, flavor: 'Dragon Strawnana', quantity: 1 },
    ],
  });

  // Elfbar Ice King 40K: Baja Splash 2x, Summer Splash 1x, Dragon Strawnana 2x
  await prisma.stock.createMany({
    data: [
      { productId: elfbarIceKing.id, flavor: 'Baja Splash', quantity: 2 },
      { productId: elfbarIceKing.id, flavor: 'Summer Splash', quantity: 1 },
      { productId: elfbarIceKing.id, flavor: 'Dragon Strawnana', quantity: 2 },
    ],
  });

  // Elfbar Trio 40K: Scary Berry 1x
  await prisma.stock.createMany({
    data: [
      { productId: elfbarTrio.id, flavor: 'Scary Berry', quantity: 1 },
    ],
  });

  // Oxbar Kit 32K: Grape Paradise 1x, Strawberry Banana Ice 1x
  await prisma.stock.createMany({
    data: [
      { productId: oxbarKit.id, flavor: 'Grape Paradise', quantity: 1 },
      { productId: oxbarKit.id, flavor: 'Strawberry Banana Ice', quantity: 1 },
    ],
  });

  console.log('Criando configurações...');
  await prisma.settings.create({
    data: {
      id: 'main',
      storeName: 'Pod Gorillas',
      storePhone: '16996152900',
      storeWhatsApp: '5516996152900',
      storeInstagram: 'pod.gorillas',
      deliveryFee: 10.0,
      deliveryCity: 'Matão',
      cashbackPercent: 3.0,
      pixDiscount: 0,
    },
  });

  console.log('=================================');
  console.log('Seed concluído com sucesso!');
  console.log('=================================');
  console.log('Admin: (16) 99999-9999 / admin123');
  console.log('=================================');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
