import Link from "next/link";

export default function InfoPage() {
  return (
    <div className="max-w-4xl mx-auto p-6 md:p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-3">Hello!</h1>
        <p className="text-muted-foreground text-lg">
          If you're on this page, you probably got here from my resume.
          <br className="mb-2"></br>
          This project started out as a learning exercise to gain experience with building out a practical relational database, but has expanded to provide meaningful functionality.
        </p>
      </div>

      <div className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">About This Project</h2>
        <p className="text-lg leading-relaxed mb-4">
          This web app is a frontend stats visualizer and dashboard I have been building out for a PostgreSQL esports database.
          It displays Counter-Strike match data through interactive visualizations and detailed analytics.
        </p>
        <p className="text-muted-foreground mb-2">
          Built with Next.js, React, and TypeScript, this dashboard queries a comprehensive PostgreSQL database containing match data,
          player statistics, round-by-round breakdowns, and positional information.
        </p>
        <p className="text-muted-foreground">
          This is still very much under development, if you come back in a week or two, there will more than likely be tweaks / updates!
          Over the past couple years, I have been experimenting with various esports data analysis related ideas, and this app contains 
          elements and inspiration from most of those projects.
        </p>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-5">Features & Pages</h2>

        <div className="space-y-6">
          <div className="border-l-4 border-primary pl-5 py-2">
            <Link href="/team" className="hover:underline">
              <h3 className="text-xl font-semibold mb-2">Team Page</h3>
            </Link>
            <p className="text-muted-foreground leading-relaxed">
              The most developed section of the dashboard. Contains comprehensive team information and interactive visualizations
              to help with scouting opponents. Includes performance metrics, map statistics, round win conditions,
              and strategic tendencies across different scenarios. Contains elements from the team defaults and player positions pages.
            </p>
          </div>

          <div className="border-l-4 border-primary pl-5 py-2">
            <Link href="/team-defaults" className="hover:underline">
              <h3 className="text-xl font-semibold mb-2">Team Defaults Page</h3>
            </Link>
            <p className="text-muted-foreground leading-relaxed">
              Provides a comprehensive overview of how teams distribute their players at the beginning of rounds.
              Analyzes starting positions across a variety of round types (pistol, eco, force-buy, full-buy) and sides (T/CT),
              helping identify patterns and default setups for strategic analysis.
            </p>
          </div>

          <div className="border-l-4 border-primary pl-5 py-2">
            <Link href="/player-position" className="hover:underline">
              <h3 className="text-xl font-semibold mb-2">Player Positions Page</h3>
            </Link>
            <p className="text-muted-foreground leading-relaxed">
              Gives an overview of all players and which positions they most commonly play on active maps.
              Visualizes player tendencies and role assignments, useful for understanding team compositions and individual player specializations.
            </p>
          </div>

          <div className="border-l-4 border-primary pl-5 py-2">
            <Link href="/" className="hover:underline">
                <h3 className="text-xl font-semibold mb-2">Player Page</h3>
            </Link>
            <p className="text-muted-foreground leading-relaxed">
              Displays basic player information and statistics from games played, including individual performance metrics
              and match history.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-10 pt-6 border-t border-border">
        <h2 className="text-2xl font-semibold mb-4">Technical Stack</h2>
        <ul className="space-y-2 text-muted-foreground">
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span><strong className="text-foreground">Frontend:</strong> Next.js (App Router), React, TypeScript, Tailwind CSS</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span><strong className="text-foreground">Data Parser:</strong> Python, demoparser2, Pandas, psycopg2</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span><strong className="text-foreground">Database:</strong> PostgreSQL with comprehensive esports data schema, primarily consisting of event based data</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span><strong className="text-foreground">Deployment:</strong> Next JS web app is deployed on Vercel, PostgreSQL database is deployed on Supabase</span>
          </li>
        </ul>
      </div>
      <div className="mt-10 pt-6 border-t border-border mb-12">
        Thank you for reading! If you have any questions, I can be contacted via email at sjharrisdc@gmail.com, or via phone at +1 (301)-802-8330
        <br/>
        - Sam
      </div>
    </div>
  );
}
