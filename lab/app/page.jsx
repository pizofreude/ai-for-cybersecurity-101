export default function Home() {
  return (
    <>
      <h1>LabShop</h1>
      <p>
        A small coffee shop app built the way many AI-assisted apps are built: Next.js, Supabase, and a chatbot.
        It has holes on purpose. Your job in class is to find them, fix them with your coding agent, and prove each fix.
      </p>
      <h2>Lab accounts</h2>
      <table>
        <thead>
          <tr><th>Who</th><th>Email</th><th>Password</th></tr>
        </thead>
        <tbody>
          <tr><td>You</td><td>alice@lab.test</td><td>alice-lab-pass</td></tr>
          <tr><td>Another customer</td><td>bob@lab.test</td><td>bob-lab-pass</td></tr>
        </tbody>
      </table>
      <p className="muted">All data is fake. Run <code>npm run reset</code> to restore it.</p>
    </>
  );
}
