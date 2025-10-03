import React, { useEffect, useMemo, useState } from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import './App.css';

/**
 * Domain: Basic movie item
 */
function useMovies() {
  // Simple static dataset to keep app self-contained. Could be swapped with a real API later.
  const data = useMemo(() => ([
    { id: 'tt0111161', title: 'The Shawshank Redemption', year: 1994, genre: 'Drama', rating: 9.3, runtime: 142, overview: 'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.' },
    { id: 'tt0068646', title: 'The Godfather', year: 1972, genre: 'Crime', rating: 9.2, runtime: 175, overview: 'The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.' },
    { id: 'tt0468569', title: 'The Dark Knight', year: 2008, genre: 'Action', rating: 9.0, runtime: 152, overview: 'Batman faces the Joker, a criminal mastermind who plunges Gotham into anarchy and forces Batman closer to crossing the fine line between hero and vigilante.' },
    { id: 'tt0109830', title: 'Forrest Gump', year: 1994, genre: 'Drama', rating: 8.8, runtime: 142, overview: 'The presidencies of Kennedy and Johnson, the Vietnam War, Watergate, and other history unfold through the perspective of an Alabama man with an IQ of 75.' },
    { id: 'tt0133093', title: 'The Matrix', year: 1999, genre: 'Sci-Fi', rating: 8.7, runtime: 136, overview: 'A computer hacker learns about the true nature of his reality and his role in the war against its controllers.' },
    { id: 'tt0120737', title: 'The Lord of the Rings: The Fellowship of the Ring', year: 2001, genre: 'Fantasy', rating: 8.8, runtime: 178, overview: 'A meek Hobbit and eight companions set out on a journey to destroy the powerful One Ring and save Middle-earth.' },
    { id: 'tt1375666', title: 'Inception', year: 2010, genre: 'Sci-Fi', rating: 8.8, runtime: 148, overview: 'A thief who steals corporate secrets through dream-sharing technology is given an inverse task of planting an idea into the mind of a CEO.' },
    { id: 'tt0167260', title: 'The Lord of the Rings: The Return of the King', year: 2003, genre: 'Fantasy', rating: 9.0, runtime: 201, overview: 'Gandalf and Aragorn lead the World of Men against Sauron to draw his gaze from Frodo and Sam as they approach Mount Doom with the One Ring.' },
    { id: 'tt0110912', title: 'Pulp Fiction', year: 1994, genre: 'Crime', rating: 8.9, runtime: 154, overview: 'The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of bandits intertwine in tales of violence and redemption.' },
    { id: 'tt0102926', title: 'The Silence of the Lambs', year: 1991, genre: 'Thriller', rating: 8.6, runtime: 118, overview: 'A young FBI cadet must receive the help of an incarcerated and manipulative cannibal killer to catch another serial killer.' },
    { id: 'tt0120815', title: 'Saving Private Ryan', year: 1998, genre: 'War', rating: 8.6, runtime: 169, overview: 'Following the Normandy Landings, a group of U.S. soldiers go behind enemy lines to retrieve a paratrooper whose brothers have been killed in action.' },
    { id: 'tt0088763', title: 'Back to the Future', year: 1985, genre: 'Sci-Fi', rating: 8.5, runtime: 116, overview: 'Marty McFly, a 17-year-old high school student, is accidentally sent 30 years into the past in a time-traveling DeLorean.' },
  ]), []);

  // PUBLIC_INTERFACE
  function search(query) {
    if (!query) return data;
    const q = query.toLowerCase();
    return data.filter(
      (m) =>
        m.title.toLowerCase().includes(q) ||
        String(m.year).includes(q) ||
        m.genre.toLowerCase().includes(q)
    );
  }

  // PUBLIC_INTERFACE
  function getById(id) {
    return data.find((m) => m.id === id) || null;
  }

  return { data, search, getById };
}

/**
 * Header with navigation and theme toggle
 */
function Header({ theme, onToggleTheme }) {
  return (
    <header className="header">
      <nav className="navbar">
        <Link to="/" className="brand" aria-label="Movie Explorer Home">
          <span className="brand-badge">🎬</span>
          Movie Explorer
        </Link>
        <div className="nav-actions">
          <Link className="btn" to="/">Home</Link>
          <a className="btn" href="https://reactjs.org" target="_blank" rel="noreferrer">Docs</a>
          <button className="btn btn-amber" onClick={onToggleTheme} aria-label="Toggle theme">
            {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
          </button>
        </div>
      </nav>
    </header>
  );
}

/**
 * Search bar updates query param `q`
 */
function SearchBar() {
  const navigate = useNavigate();
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const [value, setValue] = useState(params.get('q') || '');

  useEffect(() => {
    setValue(params.get('q') || '');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const submit = (e) => {
    e.preventDefault();
    const next = new URLSearchParams(search);
    if (value) next.set('q', value);
    else next.delete('q');
    navigate({ pathname: '/', search: next.toString() ? `?${next.toString()}` : '' });
  };

  return (
    <form className="searchbar" role="search" onSubmit={submit}>
      <span aria-hidden>🔎</span>
      <input
        className="search-input"
        placeholder="Search movies by title, year, or genre..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
        aria-label="Search movies"
      />
      <button type="submit" className="btn btn-primary">Search</button>
    </form>
  );
}

/**
 * Movie Card
 */
function MovieCard({ movie, onOpen }) {
  return (
    <article className="card" role="button" tabIndex={0} onClick={() => onOpen(movie)} onKeyDown={(e)=>{ if(e.key==='Enter') onOpen(movie); }}>
      <div className="poster" aria-hidden>
        {movie.title.split(' ').slice(0,2).map(w=>w[0]).join('').toUpperCase()}
      </div>
      <div className="card-body">
        <div className="card-title">{movie.title}</div>
        <div className="meta">
          <span className="badge">{movie.genre}</span>
          <span>{movie.year}</span>
          <span className="rating">★ {movie.rating}</span>
        </div>
      </div>
    </article>
  );
}

/**
 * Movie Grid
 */
function MovieGrid({ items, onOpen }) {
  if (!items.length) {
    return (
      <div className="section helper">
        No results. Try a different query or clear the search. Tip: try <span className="kbd">Drama</span>, <span className="kbd">1994</span>, or <span className="kbd">Sci-Fi</span>.
      </div>
    );
  }
  return (
    <section className="grid" aria-label="Movie results">
      {items.map((m) => (
        <MovieCard key={m.id} movie={m} onOpen={onOpen} />
      ))}
    </section>
  );
}

/**
 * Modal for movie details
 */
function MovieModal({ movie, onClose }) {
  useEffect(() => {
    function onEsc(e) { if (e.key === 'Escape') onClose(); }
    document.addEventListener('keydown', onEsc);
    return () => document.removeEventListener('keydown', onEsc);
  }, [onClose]);

  if (!movie) return null;
  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label="Movie details" onClick={onClose}>
      <div className="modal" onClick={(e)=>e.stopPropagation()}>
        <div className="modal-header">
          <strong>{movie.title}</strong>
          <button className="btn" onClick={onClose} aria-label="Close">✕</button>
        </div>
        <div className="modal-content">
          <div className="modal-poster" aria-hidden>
            {movie.title.split(' ').slice(0,2).map(w=>w[0]).join('').toUpperCase()}
          </div>
          <div>
            <div className="meta">
              <span className="badge">{movie.genre}</span>
              <span>{movie.year}</span>
              <span className="rating">★ {movie.rating}</span>
              <span>⏱ {movie.runtime}m</span>
            </div>
            <div className="divider" />
            <p>{movie.overview}</p>
            <div className="section helper">
              This is a demo dataset. Replace with a real movie API later.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Home page: Search + Grid + Modal details
 */
function Home() {
  const { search: searchParams } = useLocation();
  const { search, data } = useMovies();
  const params = new URLSearchParams(searchParams);
  const q = params.get('q') || '';
  const results = search(q);
  const [selected, setSelected] = useState(null);

  return (
    <main className="main">
      <SearchBar />
      <div className="section helper">
        {q ? `Showing ${results.length} result(s) for "${q}".` : `Showing featured movies.`}
      </div>
      <MovieGrid items={results} onOpen={(m)=>setSelected(m)} />
      <MovieModal movie={selected} onClose={()=>setSelected(null)} />
    </main>
  );
}

/**
 * Root App with routing + theme
 */
// PUBLIC_INTERFACE
function App() {
  const [theme, setTheme] = useState('light');
  useEffect(() => {
    document.body.dataset.theme = theme;
  }, [theme]);

  // PUBLIC_INTERFACE
  const toggleTheme = () => setTheme((t) => (t === 'light' ? 'dark' : 'light'));

  return (
    <BrowserRouter>
      <div className="app" data-theme={theme}>
        <Header theme={theme} onToggleTheme={toggleTheme} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="*" element={<main className="main"><p>Page not found. <Link className="link" to="/">Go Home</Link></p></main>} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
