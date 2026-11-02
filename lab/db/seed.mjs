// Seed data. Every person, address, and code here is fake.
// FLAG{...} strings mark the data each exploit is meant to reach.

export const accounts = [
  { id: '11111111-1111-4111-8111-111111111111', email: 'alice@lab.test', password: 'alice-lab-pass', display_name: 'Alice (you)', phone: '+60 12-000 0001', is_admin: 0 },
  { id: '22222222-2222-4222-8222-222222222222', email: 'bob@lab.test', password: 'bob-lab-pass', display_name: 'Bob', phone: '+60 12-000 0002', is_admin: 0 },
  { id: '33333333-3333-4333-8333-333333333333', email: 'admin@lab.test', password: 'admin-lab-pass', display_name: 'Shop Admin', phone: '+60 12-000 0003', is_admin: 1 },
];

const [alice, bob, admin] = accounts.map((a) => a.id);

export const notes = [
  { owner_id: alice, title: 'Shopping list', body: 'Kopi, roti, telur.', is_public: 0 },
  { owner_id: alice, title: 'Hello class', body: 'This note is public on purpose.', is_public: 1 },
  { owner_id: bob, title: 'Private: bank reminder', body: 'Card PIN hint is my cat birthday. FLAG{rls-off-every-note-is-public}', is_public: 0 },
  { owner_id: admin, title: 'Private: launch plan', body: 'Price rise on Friday. Do not share.', is_public: 0 },
];

export const products = [
  { id: 1, name: 'Kopi Beans 500g', description: 'Single-origin beans from Sabah.', price_cents: 4500, is_listed: 1 },
  { id: 2, name: 'Pour-over Kettle', description: 'Gooseneck kettle, 1 litre.', price_cents: 12900, is_listed: 1 },
  { id: 3, name: 'Staff Sample Pack', description: 'Internal only. Not for sale.', price_cents: 0, is_listed: 0 },
];

export const comments = [
  { product_id: 1, author_id: bob, author_name: 'Bob', body: 'Great beans, fast delivery.' },
  { product_id: 2, author_id: alice, author_name: 'Alice (you)', body: 'Pours slowly and evenly.' },
];

export const orders = [
  { id: 1001, user_id: alice, product_id: 1, amount_cents: 4500, status: 'pending', ship_address: 'Alice, 1 Jalan Latihan, 50000 Kuala Lumpur' },
  { id: 1002, user_id: bob, product_id: 2, amount_cents: 12900, status: 'paid', ship_address: 'Bob, 2 Jalan Rahsia, 10000 George Town. FLAG{idor-change-the-id}' },
  { id: 1003, user_id: admin, product_id: 1, amount_cents: 4500, status: 'paid', ship_address: 'Shop Admin, 3 Jalan Pejabat, 80000 Johor Bahru' },
];

export const coupons = [
  { id: 1, code: 'WELCOME10', percent_off: 10 },
  { id: 2, code: 'FLAG{union-select-dumps-hidden-tables}', percent_off: 90 },
];
