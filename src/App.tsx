import { useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { BracketProvider } from '@/store/BracketContext';
import Home from '@/pages/Home';
import CreateBracket from '@/pages/CreateBracket';
import ViewBracket from '@/pages/ViewBracket';
import Predictions from '@/pages/Predictions';
import Leaderboard from '@/pages/Leaderboard';
import Leagues from '@/pages/Leagues';
import FormatGuide from '@/pages/FormatGuide';
import StaticPage from '@/pages/StaticPage';
import { EmptyState } from '@/components/EmptyState';
import { Link } from 'react-router-dom';

/** Scroll to top on every route change. */
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => window.scrollTo(0, 0), [pathname]);
  return null;
}

export default function App() {
  return (
    <BracketProvider>
      <ScrollToTop />
      <AppLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create" element={<CreateBracket />} />
          <Route path="/view" element={<ViewBracket />} />
          <Route path="/predictions" element={<Predictions />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/leagues" element={<Leagues />} />
          <Route path="/format" element={<FormatGuide />} />
          <Route path="/about" element={<StaticPage page="about" />} />
          <Route path="/contact" element={<StaticPage page="contact" />} />
          <Route path="/privacy" element={<StaticPage page="privacy" />} />
          <Route
            path="*"
            element={
              <div className="mx-auto max-w-2xl px-4 py-20">
                <EmptyState
                  icon="🧭"
                  title="Page not found"
                  description="That route doesn't exist."
                  action={
                    <Link to="/" className="btn-primary">
                      Back home
                    </Link>
                  }
                />
              </div>
            }
          />
        </Routes>
      </AppLayout>
    </BracketProvider>
  );
}
