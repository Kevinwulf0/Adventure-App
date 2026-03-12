import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { CharacterMode, PowerLevel, generateStats, generateBackstory, generatePortraitUrl, Character } from '@/lib/dnd-engine';
import { Button } from '@/components/ui/button';
import { ArrowRight, ArrowLeft, Wand2, Sparkles, PenLine } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCharacters } from '@/hooks/use-characters';

function D20Face({ num, isRolling }: { num: number; isRolling?: boolean }) {
  // Outer hexagon vertices (die silhouette):
  //   T(32,3)  TR(57,17)  BR(57,47)  B(32,61)  BL(7,47)  TL(7,17)
  // Inner triangle (front face, centroid at 32,34):
  //   iT(32,16)  iL(16,43)  iR(48,43)
  // All 10 visible icosahedral faces are drawn individually so the
  // front face sits perfectly centred and the shading reads as 3-D.
  return (
    <motion.svg
      viewBox="0 0 64 64"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-12 h-12 shrink-0"
      aria-hidden="true"
      animate={isRolling ? {
        rotate: [0, -25, 32, -20, 26, -12, 18, -6, 8, -2, 0],
        y:      [0, -10,  4,  -7,  3,  -4,  2, -2,  1,  0, 0],
        scale:  [1, 1.2, 0.92, 1.14, 0.96, 1.07, 0.98, 1.03, 0.99, 1.01, 1],
      } : { rotate: 0, y: 0, scale: 1 }}
      transition={{ duration: 1.5, ease: "easeOut" }}
    >
      {/* ── Surrounding facets (shaded to simulate upper-left lighting) ── */}
      <polygon points="32,3  7,17  32,16"        fill="rgba(234,179,8,0.17)" stroke="currentColor" strokeWidth="1.5" />
      <polygon points="32,3  32,16 57,17"        fill="rgba(234,179,8,0.13)" stroke="currentColor" strokeWidth="1.5" />
      <polygon points="7,17  32,16 16,43"        fill="rgba(234,179,8,0.15)" stroke="currentColor" strokeWidth="1.5" />
      <polygon points="57,17 48,43 32,16"        fill="rgba(234,179,8,0.11)" stroke="currentColor" strokeWidth="1.5" />
      <polygon points="7,17  7,47  16,43"        fill="rgba(234,179,8,0.09)" stroke="currentColor" strokeWidth="1.5" />
      <polygon points="57,17 57,47 48,43"        fill="rgba(234,179,8,0.10)" stroke="currentColor" strokeWidth="1.5" />
      <polygon points="7,47  32,61 16,43"        fill="rgba(234,179,8,0.06)" stroke="currentColor" strokeWidth="1.5" />
      <polygon points="16,43 32,61 48,43"        fill="rgba(234,179,8,0.05)" stroke="currentColor" strokeWidth="1.5" />
      <polygon points="57,47 48,43 32,61"        fill="rgba(234,179,8,0.07)" stroke="currentColor" strokeWidth="1.5" />

      {/* ── Centre front face — highlighted, number lives here ── */}
      <polygon
        points="32,16 16,43 48,43"
        fill="rgba(234,179,8,0.28)"
        stroke="currentColor"
        strokeWidth="2"
      />

      {/* ── Number, centred at the centroid of the front face (32, 34) ── */}
      <text
        x="32"
        y="34"
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize={num >= 10 ? "11" : "13"}
        fontWeight="bold"
        fontFamily="Georgia, serif"
        fill="currentColor"
        stroke="none"
        letterSpacing="-0.5"
      >
        {num}
      </text>
    </motion.svg>
  );
}

function D20Button({ onRoll }: { onRoll: (name: string) => void }) {
  const [isRolling, setIsRolling] = useState(false);
  const [displayNum, setDisplayNum] = useState(20);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => () => { if (intervalRef.current) clearInterval(intervalRef.current); }, []);

  const handleClick = () => {
    if (isRolling) return;
    setIsRolling(true);

    let ticks = 0;
    const totalTicks = 20;
    // Speed starts fast, slows down toward the end
    const getDelay = (tick: number) => Math.min(50 + tick * 8, 160);

    const tick = () => {
      setDisplayNum(Math.floor(Math.random() * 20) + 1);
      ticks++;
      if (ticks >= totalTicks) {
        setDisplayNum(20);
        setIsRolling(false);
        onRoll(randomFantasyName());
      } else {
        intervalRef.current = setTimeout(tick, getDelay(ticks));
      }
    };
    intervalRef.current = setTimeout(tick, getDelay(0));
  };

  return (
    <button
      onClick={handleClick}
      disabled={isRolling}
      className="flex items-center gap-3 px-6 py-3 rounded-xl border-2 border-primary/30 bg-card text-primary font-display tracking-wider text-sm hover:border-primary hover:bg-primary/10 transition-colors duration-200 min-h-[48px] disabled:opacity-70 disabled:cursor-not-allowed"
    >
      <D20Face num={displayNum} isRolling={isRolling} />
      {isRolling ? 'Rolling...' : 'Roll a Name'}
    </button>
  );
}

interface NameQuote {
  text: string;
  source: string;
  work: string;
  year: number;
}

const NAME_QUOTES: NameQuote[] = [
  // ── Patrick Rothfuss ────────────────────────────────────────────────────
  {
    text: "Words are pale shadows of forgotten names. As names have power, words have power. Words can light fires in the minds of men.",
    source: "Patrick Rothfuss",
    work: "The Name of the Wind",
    year: 2007,
  },
  {
    text: "Not all those who wander are lost.",
    source: "J.R.R. Tolkien",
    work: "The Fellowship of the Ring",
    year: 1954,
  },
  {
    text: "All we have to decide is what to do with the time that is given us.",
    source: "J.R.R. Tolkien",
    work: "The Fellowship of the Ring",
    year: 1954,
  },
  {
    text: "Even the smallest person can change the course of the future.",
    source: "J.R.R. Tolkien",
    work: "The Fellowship of the Ring",
    year: 1954,
  },
  {
    text: "I will not say: do not weep; for not all tears are an evil.",
    source: "J.R.R. Tolkien",
    work: "The Return of the King",
    year: 1955,
  },
  {
    text: "It's a dangerous business, Frodo, going out your door. You step onto the road, and if you don't keep your feet, there's no knowing where you might be swept off to.",
    source: "J.R.R. Tolkien",
    work: "The Fellowship of the Ring",
    year: 1954,
  },
  {
    text: "Faithless is he that says farewell when the road darkens.",
    source: "J.R.R. Tolkien",
    work: "The Fellowship of the Ring",
    year: 1954,
  },
  {
    text: "In a hole in the ground there lived a hobbit. Not a nasty, dirty, wet hole — it was a hobbit-hole, and that means comfort.",
    source: "J.R.R. Tolkien",
    work: "The Hobbit",
    year: 1937,
  },
  {
    text: "Never laugh at live dragons.",
    source: "J.R.R. Tolkien",
    work: "The Hobbit",
    year: 1937,
  },
  {
    text: "Adventures are not all pony-rides in May-sunshine.",
    source: "J.R.R. Tolkien",
    work: "The Hobbit",
    year: 1937,
  },
  {
    text: "I am looking for someone to share in an adventure that I am arranging.",
    source: "J.R.R. Tolkien",
    work: "The Hobbit",
    year: 1937,
  },
  {
    text: "Speak, friend, and enter.",
    source: "J.R.R. Tolkien",
    work: "The Fellowship of the Ring",
    year: 1954,
  },
  {
    text: "It does not do to leave a live dragon out of your calculations, if you live near him.",
    source: "J.R.R. Tolkien",
    work: "The Hobbit",
    year: 1937,
  },
  {
    text: "The world is indeed full of peril, and in it there are many dark places; but still there is much that is fair, and though in all lands love is now mingled with grief, it grows perhaps the greater.",
    source: "J.R.R. Tolkien",
    work: "The Fellowship of the Ring",
    year: 1954,
  },
  {
    text: "End? No, the journey doesn't end here. Death is just another path, one that we all must take.",
    source: "J.R.R. Tolkien",
    work: "The Return of the King",
    year: 1955,
  },
  // ── J.K. Rowling ────────────────────────────────────────────────────────
  {
    text: "Fear of a name increases fear of the thing itself.",
    source: "J.K. Rowling",
    work: "Harry Potter and the Philosopher's Stone",
    year: 1997,
  },
  {
    text: "It is our choices, Harry, that show what we truly are, far more than our abilities.",
    source: "J.K. Rowling",
    work: "Harry Potter and the Chamber of Secrets",
    year: 1998,
  },
  {
    text: "Words are, in my not-so-humble opinion, our most inexhaustible source of magic.",
    source: "J.K. Rowling",
    work: "Harry Potter and the Deathly Hallows",
    year: 2007,
  },
  {
    text: "Of course it is happening inside your head, Harry, but why on earth should that mean that it is not real?",
    source: "J.K. Rowling",
    work: "Harry Potter and the Deathly Hallows",
    year: 2007,
  },
  {
    text: "To the well-organized mind, death is but the next great adventure.",
    source: "J.K. Rowling",
    work: "Harry Potter and the Philosopher's Stone",
    year: 1997,
  },
  {
    text: "We are only as strong as we are united, as weak as we are divided.",
    source: "J.K. Rowling",
    work: "Harry Potter and the Goblet of Fire",
    year: 2000,
  },
  {
    text: "The truth is a beautiful and terrible thing, and should therefore be treated with great caution.",
    source: "J.K. Rowling",
    work: "Harry Potter and the Philosopher's Stone",
    year: 1997,
  },
  // ── Patrick Rothfuss ────────────────────────────────────────────────────
  {
    text: "My name is Kvothe. I have stolen princesses back from sleeping barrow kings. I burned down the town of Trebon. I have spent the night with Felurian and left with my sanity and my life.",
    source: "Patrick Rothfuss",
    work: "The Name of the Wind",
    year: 2007,
  },
  {
    text: "It's the questions we can't answer that teach us the most. They teach us how to think.",
    source: "Patrick Rothfuss",
    work: "The Name of the Wind",
    year: 2007,
  },
  {
    text: "There are three things all wise men fear: the sea in storm, a night with no moon, and the anger of a gentle man.",
    source: "Patrick Rothfuss",
    work: "The Wise Man's Fear",
    year: 2011,
  },
  {
    text: "A long stretch of road will teach you more about yourself than a hundred years of quiet.",
    source: "Patrick Rothfuss",
    work: "The Wise Man's Fear",
    year: 2011,
  },
  // ── Ursula K. Le Guin ───────────────────────────────────────────────────
  {
    text: "To light a candle is to cast a shadow.",
    source: "Ursula K. Le Guin",
    work: "A Wizard of Earthsea",
    year: 1968,
  },
  {
    text: "You must not change one thing, one pebble, one grain of sand, until you know what good and evil will follow on that act.",
    source: "Ursula K. Le Guin",
    work: "A Wizard of Earthsea",
    year: 1968,
  },
  {
    text: "The only thing that makes life possible is permanent, intolerable uncertainty: not knowing what comes next.",
    source: "Ursula K. Le Guin",
    work: "The Left Hand of Darkness",
    year: 1969,
  },
  {
    text: "Love doesn't just sit there, like a stone; it has to be made, like bread, remade all the time, made new.",
    source: "Ursula K. Le Guin",
    work: "The Lathe of Heaven",
    year: 1971,
  },
  {
    text: "It is good to have an end to journey toward, but it is the journey that matters in the end.",
    source: "Ursula K. Le Guin",
    work: "The Left Hand of Darkness",
    year: 1969,
  },
  // ── George R.R. Martin ──────────────────────────────────────────────────
  {
    text: "A reader lives a thousand lives before he dies. The man who never reads lives only one.",
    source: "George R.R. Martin",
    work: "A Dance with Dragons",
    year: 2011,
  },
  {
    text: "When you play the game of thrones, you win or you die.",
    source: "George R.R. Martin",
    work: "A Game of Thrones",
    year: 1996,
  },
  {
    text: "The man who passes the sentence should swing the sword.",
    source: "George R.R. Martin",
    work: "A Game of Thrones",
    year: 1996,
  },
  {
    text: "Different roads sometimes lead to the same castle.",
    source: "George R.R. Martin",
    work: "A Game of Thrones",
    year: 1996,
  },
  // ── C.S. Lewis ──────────────────────────────────────────────────────────
  {
    text: "Some day you will be old enough to start reading fairy tales again.",
    source: "C.S. Lewis",
    work: "Dedication, The Lion, the Witch and the Wardrobe",
    year: 1950,
  },
  {
    text: "Courage, dear heart.",
    source: "C.S. Lewis",
    work: "The Voyage of the Dawn Treader",
    year: 1952,
  },
  {
    text: "He is not a tame lion.",
    source: "C.S. Lewis",
    work: "The Lion, the Witch and the Wardrobe",
    year: 1950,
  },
  {
    text: "There are far, far better things ahead than any we leave behind.",
    source: "C.S. Lewis",
    work: "Letters of C.S. Lewis",
    year: 1966,
  },
  // ── Neil Gaiman ─────────────────────────────────────────────────────────
  {
    text: "Fairy tales are more than true: not because they tell us that dragons exist, but because they tell us that dragons can be beaten.",
    source: "Neil Gaiman",
    work: "Coraline",
    year: 2002,
  },
  {
    text: "Stories are like roads leading to the places you'd never find on your own.",
    source: "Neil Gaiman",
    work: "The Graveyard Book",
    year: 2008,
  },
  {
    text: "You get what anybody gets — you get a lifetime.",
    source: "Neil Gaiman",
    work: "The Sandman: Dream Country",
    year: 1991,
  },
  {
    text: "Ghosts are memories. That's all they are — stories that the living tell themselves to make the world make sense.",
    source: "Neil Gaiman",
    work: "American Gods",
    year: 2001,
  },
  {
    text: "There's never been a true war that wasn't fought between two sets of people who were certain they were in the right.",
    source: "Neil Gaiman",
    work: "American Gods",
    year: 2001,
  },
  {
    text: "God does not play dice with the universe; He plays an ineffable game of his own devising.",
    source: "Terry Pratchett & Neil Gaiman",
    work: "Good Omens",
    year: 1990,
  },
  // ── Terry Pratchett ─────────────────────────────────────────────────────
  {
    text: "Stories of imagination tend to upset those without one.",
    source: "Terry Pratchett",
    work: "Hogfather",
    year: 1996,
  },
  {
    text: "People think that stories are shaped by people. In fact, it's the other way around.",
    source: "Terry Pratchett",
    work: "Witches Abroad",
    year: 1991,
  },
  {
    text: "In the beginning there was nothing, which exploded.",
    source: "Terry Pratchett",
    work: "Lords and Ladies",
    year: 1992,
  },
  {
    text: "Sometimes it is better to light a flamethrower than curse the darkness.",
    source: "Terry Pratchett",
    work: "Men at Arms",
    year: 1993,
  },
  {
    text: "The truth may be out there, but lies are inside your head.",
    source: "Terry Pratchett",
    work: "Hogfather",
    year: 1996,
  },
  {
    text: "Fantasy is an exercise bicycle for the mind. It might not take you anywhere, but it tones up the muscles that can.",
    source: "Terry Pratchett",
    work: "Introduction, Wyrm's Footprints",
    year: 1993,
  },
  {
    text: "Stories have to be told or they die, and when they die, we can't remember who we are or why we're here.",
    source: "Terry Pratchett",
    work: "Witches Abroad",
    year: 1991,
  },
  // ── Brandon Sanderson ───────────────────────────────────────────────────
  {
    text: "The most important step a man can take. It's not the first one, is it? It's the next one. Always the next step.",
    source: "Brandon Sanderson",
    work: "Oathbringer",
    year: 2017,
  },
  {
    text: "There is always another secret.",
    source: "Brandon Sanderson",
    work: "Mistborn: The Final Empire",
    year: 2006,
  },
  {
    text: "I will remember those who have been forgotten.",
    source: "Brandon Sanderson",
    work: "Words of Radiance",
    year: 2014,
  },
  {
    text: "The purpose of a storyteller is not to tell you how to think, but to give you questions to think upon.",
    source: "Brandon Sanderson",
    work: "The Way of Kings",
    year: 2010,
  },
  {
    text: "A story doesn't say anything. It just is. What people make of it is up to them.",
    source: "Brandon Sanderson",
    work: "Elantris",
    year: 2005,
  },
  // ── Robert Jordan ────────────────────────────────────────────────────────
  {
    text: "The Wheel of Time turns, and Ages come and pass, leaving memories that become legend.",
    source: "Robert Jordan",
    work: "The Eye of the World",
    year: 1990,
  },
  {
    text: "The wheel weaves as the wheel wills.",
    source: "Robert Jordan",
    work: "The Eye of the World",
    year: 1990,
  },
  {
    text: "Death is lighter than a feather, duty heavier than a mountain.",
    source: "Robert Jordan",
    work: "The Eye of the World",
    year: 1990,
  },
  // ── Leigh Bardugo ────────────────────────────────────────────────────────
  {
    text: "The heart is an arrow. It demands aim to land true.",
    source: "Leigh Bardugo",
    work: "Six of Crows",
    year: 2015,
  },
  {
    text: "No mourners. No funerals.",
    source: "Leigh Bardugo",
    work: "Six of Crows",
    year: 2015,
  },
  {
    text: "I am not ruined. I am ruination.",
    source: "Leigh Bardugo",
    work: "Crooked Kingdom",
    year: 2016,
  },
  // ── Robin Hobb ───────────────────────────────────────────────────────────
  {
    text: "There is magic in names. And it is not a small magic.",
    source: "Robin Hobb",
    work: "Assassin's Apprentice",
    year: 1995,
  },
  {
    text: "The fool knows who he is. The rest of us spend our lives finding out.",
    source: "Robin Hobb",
    work: "Fool's Errand",
    year: 2001,
  },
  // ── Christopher Paolini ─────────────────────────────────────────────────
  {
    text: "Live in the present, remember the past, and fear not the future, for it doesn't exist and never shall.",
    source: "Christopher Paolini",
    work: "Eragon",
    year: 2003,
  },
  // ── Michael Ende ─────────────────────────────────────────────────────────
  {
    text: "Every real story is a Never Ending Story.",
    source: "Michael Ende",
    work: "The Neverending Story",
    year: 1979,
  },
  // ── William Goldman ──────────────────────────────────────────────────────
  {
    text: "Hello. My name is Inigo Montoya. You killed my father. Prepare to die.",
    source: "William Goldman",
    work: "The Princess Bride",
    year: 1973,
  },
  {
    text: "Life is pain, Highness. Anyone who says differently is selling something.",
    source: "William Goldman",
    work: "The Princess Bride",
    year: 1973,
  },
  {
    text: "As you wish.",
    source: "William Goldman",
    work: "The Princess Bride",
    year: 1973,
  },
  // ── Diana Wynne Jones ────────────────────────────────────────────────────
  {
    text: "I think we ought to live happily ever after.",
    source: "Diana Wynne Jones",
    work: "Howl's Moving Castle",
    year: 1986,
  },
  // ── Joe Abercrombie ──────────────────────────────────────────────────────
  {
    text: "You have to be realistic about these things.",
    source: "Joe Abercrombie",
    work: "The Blade Itself",
    year: 2006,
  },
  {
    text: "The blade itself incites to deeds of violence.",
    source: "Joe Abercrombie",
    work: "The Blade Itself",
    year: 2006,
  },
  // ── Madeline Miller ──────────────────────────────────────────────────────
  {
    text: "I could recognize him by touch alone, by smell; I would know him blind, by the way his breaths came and his feet struck the earth.",
    source: "Madeline Miller",
    work: "The Song of Achilles",
    year: 2011,
  },
  {
    text: "Name one hero who was happy.",
    source: "Madeline Miller",
    work: "The Song of Achilles",
    year: 2011,
  },
  {
    text: "I am made of memories.",
    source: "Madeline Miller",
    work: "Circe",
    year: 2018,
  },
  // ── Jim Butcher ──────────────────────────────────────────────────────────
  {
    text: "My name is Harry Blackstone Copperfield Dresden. Conjure by it at your own risk.",
    source: "Jim Butcher",
    work: "Storm Front",
    year: 2000,
  },
  // ── Terry Brooks ─────────────────────────────────────────────────────────
  {
    text: "Sometimes the journey is more important than the destination.",
    source: "Terry Brooks",
    work: "The Sword of Shannara",
    year: 1977,
  },
  // ── Robert E. Howard ─────────────────────────────────────────────────────
  {
    text: "Conan the Cimmerian. That name had spread across the world like fire across dry grass.",
    source: "Robert E. Howard",
    work: "The Hour of the Dragon",
    year: 1936,
  },
  // ── Anne McCaffrey ───────────────────────────────────────────────────────
  {
    text: "Impress a dragon, and your life is linked with his, for better or for worse.",
    source: "Anne McCaffrey",
    work: "Dragonflight",
    year: 1968,
  },
  // ── T.H. White ───────────────────────────────────────────────────────────
  {
    text: "The best thing for being sad is to learn something.",
    source: "T.H. White",
    work: "The Once and Future King",
    year: 1958,
  },
  {
    text: "You are the best knight I have ever heard of. Now I have to find out whether you are a good man.",
    source: "T.H. White",
    work: "The Once and Future King",
    year: 1958,
  },
  // ── Piers Anthony ────────────────────────────────────────────────────────
  {
    text: "The sword was not the answer, but sometimes one had to speak its language.",
    source: "Piers Anthony",
    work: "A Spell for Chameleon",
    year: 1977,
  },
  // ── Roger Zelazny ────────────────────────────────────────────────────────
  {
    text: "My name is a killing word.",
    source: "Roger Zelazny",
    work: "Nine Princes in Amber",
    year: 1970,
  },
  {
    text: "I have walked in places where names have power beyond your imagining.",
    source: "Roger Zelazny",
    work: "Nine Princes in Amber",
    year: 1970,
  },
  // ── Guy Gavriel Kay ──────────────────────────────────────────────────────
  {
    text: "There are no wrong roads to anywhere.",
    source: "Guy Gavriel Kay",
    work: "Tigana",
    year: 1990,
  },
  {
    text: "To name a thing is to own it. This is the first truth of magic.",
    source: "Guy Gavriel Kay",
    work: "Tigana",
    year: 1990,
  },
  // ── Patricia McKillip ────────────────────────────────────────────────────
  {
    text: "A name is a road. It leads you somewhere.",
    source: "Patricia A. McKillip",
    work: "The Riddle-Master of Hed",
    year: 1976,
  },
  // ── Tad Williams ─────────────────────────────────────────────────────────
  {
    text: "Beginnings are always messy.",
    source: "Tad Williams",
    work: "The Dragonbone Chair",
    year: 1988,
  },
  // ── David Eddings ────────────────────────────────────────────────────────
  {
    text: "The world has always been filled with heroes. Most of them just don't know it yet.",
    source: "David Eddings",
    work: "Pawn of Prophecy",
    year: 1982,
  },
  // ── Fantasy Films ────────────────────────────────────────────────────────
  {
    text: "I am no man!",
    source: "Fran Walsh, Philippa Boyens & Peter Jackson",
    work: "The Lord of the Rings: The Return of the King (film)",
    year: 2003,
  },
  {
    text: "A wizard is never late, nor is he early; he arrives precisely when he means to.",
    source: "Fran Walsh, Philippa Boyens & Peter Jackson",
    work: "The Lord of the Rings: The Fellowship of the Ring (film)",
    year: 2001,
  },
  {
    text: "You have no power over me.",
    source: "Terry Jones & Dennis Lee",
    work: "Labyrinth (film)",
    year: 1986,
  },
  {
    text: "It does not do to forget one's name.",
    source: "Hayao Miyazaki",
    work: "Spirited Away (film)",
    year: 2001,
  },
  {
    text: "It is the doom of men that they forget.",
    source: "John Boorman",
    work: "Excalibur (film)",
    year: 1981,
  },
  // ── Additional ───────────────────────────────────────────────────────────
  {
    text: "A hero is someone who has given his or her life to something bigger than oneself.",
    source: "Joseph Campbell",
    work: "The Hero with a Thousand Faces",
    year: 1949,
  },
  {
    text: "When the hero's journey is taken, the first step is always the hardest and the most important.",
    source: "Joseph Campbell",
    work: "The Power of Myth",
    year: 1988,
  },
  {
    text: "She is too fond of books, and it has turned her brain.",
    source: "Louisa May Alcott",
    work: "Little Women",
    year: 1868,
  },
  {
    text: "There is no real ending. It's just the place where you stop the story.",
    source: "Frank Herbert",
    work: "Dune",
    year: 1965,
  },
  {
    text: "I must not fear. Fear is the mind-killer.",
    source: "Frank Herbert",
    work: "Dune",
    year: 1965,
  },
];

const FANTASY_NAMES = [
  'Aelindra', 'Aethos', 'Aldric', 'Arannis', 'Aravel', 'Ardyn', 'Arindel', 'Aurelion',
  'Baelindra', 'Baern', 'Balasar', 'Belegorn', 'Bryndis', 'Caldris',
  'Caelindra', 'Caius', 'Caoimhe', 'Casvian', 'Cethric', 'Ciaran', 'Corvin',
  'Daemar', 'Daeren', 'Dalamar', 'Davan', 'Diavara', 'Draeven', 'Drystan',
  'Eladrin', 'Elowen', 'Elspeth', 'Emryn', 'Eryndis', 'Estelline',
  'Faelion', 'Faeryn', 'Falcrest', 'Fendrys', 'Feyra', 'Fionn',
  'Galadwen', 'Garim', 'Garrick', 'Gedwyn', 'Gethian', 'Gorvyn',
  'Halvard', 'Hawthorn', 'Heliovar', 'Hrothgar',
  'Idris', 'Ilindra', 'Ilyran', 'Isadora', 'Ivaine',
  'Jaeron', 'Jorah', 'Jorindel', 'Jorvyn',
  'Kaeda', 'Kaelen', 'Kaladrix', 'Kethara', 'Korinn', 'Kyreveth',
  'Laelindra', 'Landreth', 'Liriel', 'Lorvyn', 'Lucan', 'Lyrian',
  'Maelindra', 'Malachar', 'Malgavin', 'Marvyn', 'Mordecai', 'Morrigan',
  'Naevara', 'Naldrin', 'Naomi', 'Nessa', 'Noctis', 'Nyxara',
  'Oberon', 'Oisin', 'Orivyn', 'Osveth',
  'Phaedra', 'Phelan', 'Pyreth',
  'Quentara', 'Quinlan',
  'Raedyn', 'Rhaenys', 'Riordan', 'Rodaveth', 'Rowan', 'Rykas',
  'Saelindra', 'Sariel', 'Seraphina', 'Severin', 'Silindra', 'Solara', 'Sylvara',
  'Taelindra', 'Thalion', 'Theron', 'Thornwick', 'Toryn', 'Traevin',
  'Ulindra', 'Urien', 'Uryndis',
  'Vaelis', 'Valdris', 'Varek', 'Velayn', 'Veridian', 'Vorath',
  'Wulfric', 'Wynnara',
  'Xanathos', 'Xivara',
  'Yaelindra', 'Ysolde',
  'Zaera', 'Zalindra', 'Zephyros', 'Zorindel',
];

const FANTASY_SURNAMES = [
  'Ashveil', 'Blackthorn', 'Bloodmoon', 'Coldwater', 'Darkwood', 'Dawnbringer',
  'Dragonsbane', 'Duskmantle', 'Emberveil', 'Emberglass', 'Eventide',
  'Frostweave', 'Ghostwalker', 'Gloomhaven', 'Goldenveil', 'Greywarden',
  'Hellfire', 'Hollowstone', 'Ironveil', 'Jadeheart', 'Lightbane', 'Lorekeep',
  'Moonwhisper', 'Morvath', 'Nightfall', 'Nightshade', 'Oakheart', 'Ravenscroft',
  'Redmane', 'Runekeeper', 'Shadowend', 'Shadowmere', 'Shadowveil',
  'Shadowweaver', 'Silverblade', 'Silverstone', 'Skullcleaver', 'Snowmantle',
  'Soulreaper', 'Starfall', 'Stoneheart', 'Stormcaller', 'Stormcloak',
  'Stormsong', 'Stormveil', 'Sundering', 'Swiftarrow', 'Thorngate',
  'Thundermantle', 'Voidwalker', 'Warstone', 'Whitefang', 'Wildborn',
  'Windchaser', 'Winterborne', 'Witchwood', 'Wraithbane', 'Wyrmtongue',
];

function randomFantasyName(): string {
  const first = FANTASY_NAMES[Math.floor(Math.random() * FANTASY_NAMES.length)];
  const last = FANTASY_SURNAMES[Math.floor(Math.random() * FANTASY_SURNAMES.length)];
  return `${first} ${last}`;
}

const RACES = [
  'Aarakocra', 'Aasimar', 'Astral Elf', 'Autognome',
  'Bugbear', 'Centaur', 'Changeling',
  'Deep Gnome', 'Dhampir', 'Dragonborn', 'Drow', 'Duergar', 'Dwarf',
  'Eladrin', 'Elf', 'Fairy', 'Firbolg',
  'Genasi', 'Giff', 'Githyanki', 'Githzerai', 'Gnome', 'Goblin', 'Goliath', 'Grung',
  'Hadozee', 'Half-Elf', 'Half-Orc', 'Halfling', 'Harengon', 'Hexblood', 'High Elf', 'Hobgoblin', 'Human',
  'Kalashtar', 'Kender', 'Kenku', 'Kobold',
  'Leonin', 'Lizardfolk', 'Locathah', 'Lotusden Halfling', 'Loxodon',
  'Minotaur',
  'Orc', 'Owlin',
  'Pallid Elf', 'Plasmoid',
  'Reborn',
  'Satyr', 'Sea Elf', 'Shadar-kai', 'Shifter', 'Simic Hybrid',
  'Tabaxi', 'Thri-kreen', 'Tiefling', 'Tortle', 'Triton',
  'Vedalken', 'Verdan',
  'Warforged', 'Wood Elf',
  'Yuan-ti Pureblood',
  'Other',
];

interface RaceFact {
  text: string;
  race: string;
}

const RACE_FACTS: RaceFact[] = [
  // Aarakocra
  { race: "Aarakocra", text: "Aarakocra can fly up to 50 feet per round, making them the fastest airborne race among all core Player's Handbook options." },
  { race: "Aarakocra", text: "Aarakocra originate from the Elemental Plane of Air, where they serve the Wind Dukes of Aaqa as scouts and messengers." },
  { race: "Aarakocra", text: "Their talons deal 1d4 slashing damage as a natural weapon — making them dangerous combatants even without a blade in hand." },
  { race: "Aarakocra", text: "Many Dungeon Masters ban Aarakocra from low-level play — the ability to fly at level 1 bypasses enormous amounts of dungeon design." },
  // Aasimar
  { race: "Aasimar", text: "Every Aasimar is guided by a celestial being that communicates through dreams and visions, acting as a divine conscience." },
  { race: "Aasimar", text: "The three Aasimar subraces reflect different divine callings: Protector (guardian), Scourge (punisher), and Fallen (corrupted)." },
  { race: "Aasimar", text: "Aasimar are the celestial counterpart to Tieflings — where tieflings carry fiendish blood, aasimar radiate the light of the Upper Planes." },
  { race: "Aasimar", text: "A Fallen Aasimar represents what happens when celestial purpose is corrupted — they are D&D's take on the concept of the fallen angel." },
  // Astral Elf
  { race: "Astral Elf", text: "Astral Elves have lived so long in the timeless Astral Sea that they no longer need to trance — they simply do not age." },
  { race: "Astral Elf", text: "Due to their timeless existence, Astral Elves often seem detached from mortal concerns, viewing centuries as most people view weeks." },
  // Autognome
  { race: "Autognome", text: "Autognomes are mechanical constructs built by gnome artificers — clockwork beings that gained true sentience." },
  { race: "Autognome", text: "Like Warforged, Autognomes don't need to eat or breathe, but they do require maintenance — they carry spare parts as a survival instinct." },
  // Bugbear
  { race: "Bugbear", text: "Bugbears are the largest of the goblinoid races, standing 7 to 8 feet tall with powerful frames built specifically for ambush." },
  { race: "Bugbear", text: "Despite their size, Bugbears are naturally stealthy — their racial Skulker trait lets them hide where only a sliver of shadow falls." },
  { race: "Bugbear", text: "Bugbear arms are disproportionately long, giving them an extra 5 feet of reach on melee attacks — they fight like living polearms." },
  // Centaur
  { race: "Centaur", text: "Centaurs from the Theros setting are devotees of the wild god Nylea — they serve as her messengers and forest wardens." },
  { race: "Centaur", text: "A Centaur's Charge ability lets them deal bonus damage when they move at least 30 feet toward a target before attacking." },
  { race: "Centaur", text: "Centaurs technically count as Large creatures from the waist down — their lower body can be used as a mount by a Tiny creature." },
  // Changeling
  { race: "Changeling", text: "A Changeling's true face is actually a blank, featureless neutral mask — the face they were born with before they learned to shape it." },
  { race: "Changeling", text: "In Eberron, Changelings are the children of doppelgangers and humans, inheriting the ability to shift form at will." },
  { race: "Changeling", text: "Changelings can alter height, weight, voice, and facial features — but their clothing and equipment remain unchanged, a common disguise flaw." },
  { race: "Changeling", text: "The Traveler, a chaotic neutral deity of deception and change, is the patron god worshipped by many in Changeling society." },
  // Deep Gnome
  { race: "Deep Gnome", text: "Deep Gnomes (Svirfneblin) live in the Underdark city of Blingdenstone — one of the few non-drow settlements beneath the surface world." },
  { race: "Deep Gnome", text: "Svirfneblin skin evolved over millennia to range from dark rocky grey to brown, blending seamlessly with Underdark stone walls." },
  { race: "Deep Gnome", text: "Deep Gnomes have innate Nondetection as a racial trait, making them invisible to magical divination — a critical survival tool below ground." },
  // Dhampir
  { race: "Dhampir", text: "Dhampirs are half-vampire mortals — touched by the vampire's curse but not fully transformed, still clinging to the warmth of the living." },
  { race: "Dhampir", text: "A Dhampir's Spider Climb ability — moving up walls and across ceilings — is a hallmark of their vampiric ancestry." },
  { race: "Dhampir", text: "Dhampirs can sustain themselves on normal food and water, but feeding on blood provides them a temporary boost to vitality." },
  // Dragonborn
  { race: "Dragonborn", text: "There are 10 types of draconic ancestry available to Dragonborn — each granting a different breath weapon element and damage type." },
  { race: "Dragonborn", text: "In the Forgotten Realms, Dragonborn trace their spiritual lineage to the god Io, who split himself into Bahamut and Tiamat." },
  { race: "Dragonborn", text: "Chromatic, Metallic, and Gem Dragonborn represent three families of dragon — chaos, order, and the neutrality of pure thought." },
  { race: "Dragonborn", text: "In the Exandria setting, Dragonborn founded the empire of Draconia — a floating chain of islands reserved exclusively for their kind." },
  { race: "Dragonborn", text: "A Dragonborn's breath weapon is one of only a handful of racial features in 5e that scales with character level." },
  // Drow
  { race: "Drow", text: "Drow were cursed by the goddess Corellon and driven underground for worshipping the spider queen Lolth — their exile shaped all of Underdark history." },
  { race: "Drow", text: "Drow have 120 feet of darkvision — twice the range of most races — an adaptation developed over millennia in the lightless Underdark." },
  { race: "Drow", text: "Drizzt Do'Urden, the most famous Drow in D&D fiction, has been defying his culture's evil reputation since R.A. Salvatore's 'The Crystal Shard' in 1988." },
  { race: "Drow", text: "Drow society is strictly matriarchal — led by high priestesses of Lolth — and noble houses compete ruthlessly for their goddess's divine favor." },
  { race: "Drow", text: "In Menzoberranzan, the most famous Drow city, house rank determines everything — officially sanctioned assassination of rivals is considered a religious act." },
  { race: "Drow", text: "Male Drow are typically warriors or wizards; only females may ascend to the priesthood, the highest position of power in Drow society." },
  { race: "Drow", text: "Drow steel equipment disintegrates rapidly when exposed to sunlight — a limitation that makes surface raids both daring and costly." },
  // Duergar
  { race: "Duergar", text: "Duergar, the gray dwarves, were enslaved by mind flayers for thousands of years in the Underdark — and gained psionic abilities as a result." },
  { race: "Duergar", text: "Duergar can magically enlarge themselves to twice their normal size or turn invisible — psychic gifts from their illithid captors." },
  { race: "Duergar", text: "Unlike regular dwarves, Duergar are immune to both paralysis and illusion magic, hardened by centuries of mental subjugation." },
  { race: "Duergar", text: "Duergar skin ranges from charcoal grey to ash white, and their eyes are said to glow faintly red when viewed in absolute darkness." },
  { race: "Duergar", text: "Duergar society in Gracklstugh is built around the twin gods Laduguer and Deep Duerra — both former dwarven heroes who ascended to godhood." },
  // Dwarf
  { race: "Dwarf", text: "A Dwarf who reaches 350 years old is considered middle-aged — they can live well past 400 years, carrying centuries of accumulated grudges." },
  { race: "Dwarf", text: "Every Dwarf clan maintains a 'grudge book' — a tome listing every insult done to the clan across generations, never forgetting a single slight." },
  { race: "Dwarf", text: "The dwarven god Moradin is called the 'Soul Forger' — said to have hammered the first dwarves out of iron and stone at the heart of the world." },
  { race: "Dwarf", text: "Dwarves move at 25 feet per round — slower than most races — but their speed is never reduced by wearing heavy armor." },
  { race: "Dwarf", text: "Stonecunning gives dwarves advantage on History checks related to stonework — they can feel the difference between natural caves and worked stone." },
  // Eladrin
  { race: "Eladrin", text: "Eladrin embody the four seasons — Spring, Summer, Autumn, and Winter — with their personality and alignment shifting as the seasons change." },
  { race: "Eladrin", text: "An Eladrin's Fey Step lets them teleport up to 30 feet as a bonus action, with bonus effects based on their current season." },
  { race: "Eladrin", text: "In Summer, an Eladrin radiates warmth that burns — enemies adjacent when they Fey Step take fire damage." },
  { race: "Eladrin", text: "Eladrin once lived on the Material Plane but retreated into the Feywild long ago, and have since become more fey than mortal." },
  // Elf
  { race: "Elf", text: "Elves don't sleep — they enter a meditative trance called 'Reverie' for 4 hours, reliving memories of past centuries." },
  { race: "Elf", text: "Elves are considered adults at 100 years old, though they can live to 750 years or more — childhood alone lasts a human lifetime." },
  { race: "Elf", text: "The Elven god Corellon Larethian created all elves, and legend holds the first elf sprang from a divine teardrop shed in battle." },
  { race: "Elf", text: "Elves cannot be put to sleep by magical means — their Fey Ancestry trait also gives them advantage against charm effects." },
  { race: "Elf", text: "The Elven language is one of the most widely spoken tongues in D&D settings — considered the original language of the Feywild itself." },
  // Fairy
  { race: "Fairy", text: "Fairies are one of only three core races with natural flight from level 1 — making them controversial picks for indoor dungeon crawls." },
  { race: "Fairy", text: "Fairies have innate access to Faerie Fire and Enlarge/Reduce — the perfect trickster toolkit for any adventuring party." },
  { race: "Fairy", text: "In Feywild lore, Fairies are the most commonly encountered fey — playful, capricious, and utterly unpredictable in their loyalties." },
  // Firbolg
  { race: "Firbolg", text: "Firbolgs are giant-kin who live as reclusive forest guardians — their name means 'Great Elder' in the Giant tongue." },
  { race: "Firbolg", text: "Firbolg culture holds that speaking names aloud gives power to enemies — so they speak about themselves in the third person or use oblique titles." },
  { race: "Firbolg", text: "Firbolgs can detect magic within 60 feet at will, and magically disguise themselves as any Medium humanoid for up to 10 minutes." },
  { race: "Firbolg", text: "Firbolgs share a mystical bond with nature — they can communicate simple ideas with beasts and plants using a kind of wordless empathy." },
  // Genasi
  { race: "Genasi", text: "The four Genasi subraces — Air, Earth, Fire, and Water — correspond to the four elemental planes and the great genie civilizations within." },
  { race: "Genasi", text: "Fire Genasi are born from unions with efreet (fire genies), giving them a natural resistance to fire and the ability to create magical light." },
  { race: "Genasi", text: "Water Genasi can breathe water indefinitely and speak with any creature that breathes water — making them the most aquatic core race." },
  { race: "Genasi", text: "Earth Genasi can pass through solid stone or packed dirt without disturbing it, briefly becoming one with the rock itself." },
  { race: "Genasi", text: "Air Genasi carry a permanent personal breeze at all times — their hair and clothing move even in a sealed, windless room." },
  // Giff
  { race: "Giff", text: "Giff are hippo-folk from the Spelljammer setting — mercenary warriors who are obsessed with firearms and military protocol." },
  { race: "Giff", text: "A Giff's Hippogriff Charge lets them deal bonus damage when they move 20 feet in a straight line toward a target before attacking." },
  { race: "Giff", text: "Giff society is organized around military ranks — even their merchants and scholars hold honorary military titles." },
  // Githyanki
  { race: "Githyanki", text: "Githyanki live aboard astral ships, raiding both the Astral Plane and the Material Plane while serving their lich-queen Vlaakith." },
  { race: "Githyanki", text: "Every Githyanki of sufficient power carries a silver sword — a blade that can sever an opponent's silver cord on the Astral Plane, killing them instantly." },
  { race: "Githyanki", text: "Githyanki were once slaves of the illithid empire — the great revolution led by the hero Gith liberated their race and scarred the mind flayers forever." },
  { race: "Githyanki", text: "Githyanki psionics allow them to cast Jump, Misty Step, and Plane Shift — all framed as mental projections rather than arcane magic." },
  // Githzerai
  { race: "Githzerai", text: "Githzerai make their monasteries in Limbo — the plane of pure chaos — bending the environment through sheer mental will to create stable ground." },
  { race: "Githzerai", text: "Githzerai are the philosophical counterparts to the militant Githyanki: monastic, disciplined, and devoted to inner peace above conquest." },
  { race: "Githzerai", text: "The Githzerai founder, Zerthimon, is worshipped as a near-divine figure — their philosophy is called the 'Teachings of Zerthimon.'" },
  // Gnome
  { race: "Gnome", text: "Gnomes have advantage on all mental saving throws against magic — their Gnomish Cunning represents centuries of outwitting fey tricksters." },
  { race: "Gnome", text: "Forest Gnomes can communicate with small beasts and cast Minor Illusion at will — living at the boundary between the natural and illusory worlds." },
  { race: "Gnome", text: "Rock Gnomes are the only core race with proficiency in Tinker's Tools, allowing them to build small clockwork devices as a racial ability." },
  { race: "Gnome", text: "The gnomish god Garl Glittergold is a prankster deity — he once collapsed a dragon's lair through an elaborate trick, saving his people." },
  // Goblin
  { race: "Goblin", text: "Goblins are the most commonly encountered monster in D&D history — appearing in every single edition of the game since 1974." },
  { race: "Goblin", text: "Goblin player characters can Disengage or Hide as a bonus action — a feature that makes them surprisingly slippery in combat." },
  { race: "Goblin", text: "Goblins worship a pantheon led by Maglubiyet, the 'Conquering God,' depicted as a pitch-black axe-wielding warrior of divine fury." },
  { race: "Goblin", text: "In the Forgotten Realms jungle, a subspecies called the 'Batiri' form organized war-bands that have sacked entire villages." },
  // Goliath
  { race: "Goliath", text: "Goliath culture keeps a running score of lifetime accomplishments — a tradition called 'The Tale' that determines one's social standing." },
  { race: "Goliath", text: "Goliath society values fair competition above all — cheating, or using any unfair advantage, is their deepest cultural taboo." },
  { race: "Goliath", text: "Stone's Endurance lets Goliaths reduce incoming damage by 1d12 + Constitution modifier once per short rest — their skin is literally tough as rock." },
  { race: "Goliath", text: "Goliaths are descended from ancient giants but developed into a separate race over thousands of years of isolated mountain life." },
  // Grung
  { race: "Grung", text: "Grungs are poisonous frog-folk from the Forgotten Realms jungles — their skin secretes toxins that can be absorbed through contact." },
  { race: "Grung", text: "Grung society is rigidly stratified by color — green Grungs are warriors, orange are crafters, red are scholars, and gold are royalty." },
  { race: "Grung", text: "A Grung's natural poison coating is so potent it can affect creatures that merely touch their skin, not just those they attack." },
  // Hadozee
  { race: "Hadozee", text: "Hadozee are spacefaring simians from the Spelljammer setting — they use skin flaps between their limbs to glide between ship decks." },
  { race: "Hadozee", text: "A Hadozee's patagial membranes let them slow their fall to 60 feet per round, taking no damage from falls of 100 feet or less." },
  { race: "Hadozee", text: "The Hadozee as a culture began with a single bargain — they traded service to a wizard for training, and space-faring became their destiny." },
  // Half-Elf
  { race: "Half-Elf", text: "Half-Elves are one of the few races with no 'true homeland' — belonging fully to neither elven nor human society, perpetual outsiders." },
  { race: "Half-Elf", text: "Half-Elves gain proficiency in two skills of their choice at character creation — making them the most versatile race for building any class." },
  { race: "Half-Elf", text: "Half-Elf lifespans range from 150 to 200 years — far shorter than full elves, a constant quiet reminder of their human mortality." },
  { race: "Half-Elf", text: "In Eberron, half-elves with Dragonmarks belong to House Lyrandar (Mark of Storm) or House Medani (Mark of Detection)." },
  // Half-Orc
  { race: "Half-Orc", text: "Half-Orcs are the only core race with a death-defying ability: Relentless Endurance drops them to 1 HP instead of 0, once per long rest." },
  { race: "Half-Orc", text: "Savage Attacks means a Half-Orc adds an extra weapon damage die on every critical hit — making crits dramatically more devastating." },
  { race: "Half-Orc", text: "Many Half-Orcs in Waterdeep serve in the city guard, valued for their strength, resilience, and dedication to proving their worth." },
  // Halfling
  { race: "Halfling", text: "Halflings were called 'Hobbits' in the earliest D&D manuscripts — Tolkien's estate required a name change before publication." },
  { race: "Halfling", text: "Halfling Lucky lets them reroll any natural 1 on attacks, ability checks, or saving throws — making them statistically resistant to catastrophic failure." },
  { race: "Halfling", text: "Halflings have never had a homeland they could call their own — they live as wanderers or in small communities nestled within human cities." },
  { race: "Halfling", text: "The halfling god Yondalla, the 'Protector and Provider,' is depicted as a plump, cheerful woman carrying a cornucopia and a shield." },
  // Harengon
  { race: "Harengon", text: "Harengon are rabbit-folk who escaped the Feywild into the Material Plane — their hopping movement still carries echoes of fey energy." },
  { race: "Harengon", text: "A Harengon's Lucky Footwork lets them add 1d4 to Dexterity saving throws — their legendary fey-touched reflexes are built into their bones." },
  { race: "Harengon", text: "Harengon can leap extraordinary distances without a running start, treating any jump as if they had full momentum." },
  // Hexblood
  { race: "Hexblood", text: "Hexbloods are mortals permanently marked by a hag's bargain or curse — not fully transformed, but never quite human again either." },
  { race: "Hexblood", text: "The eerie streak of white hair common to Hexbloods is called a 'witch's mark' — considered an omen of ill fortune by superstitious folk." },
  { race: "Hexblood", text: "Hexbloods can transmit whispered messages to others through their Hex magic — sending short words across vast distances once per day." },
  // High Elf
  { race: "High Elf", text: "High Elves are the most magically gifted elven subrace, born with one wizard cantrip of their choice already woven into their mind." },
  { race: "High Elf", text: "In the Forgotten Realms, High Elves (called 'Tel'Quessir') once ruled the magical empire of Myth Drannor before its catastrophic fall." },
  { race: "High Elf", text: "High Elves speak Elvish, Common, and one additional language of their choice — the broadest linguistic gift of any elven subrace." },
  { race: "High Elf", text: "The High Elves of the Forgotten Realms trace their civilization back over 30,000 years — making them the oldest continuous culture on Toril." },
  // Hobgoblin
  { race: "Hobgoblin", text: "Hobgoblins are the most militaristic goblinoid race — their armies use complex strategy, flanking maneuvers, and actual supply line logistics." },
  { race: "Hobgoblin", text: "Hobgoblin culture is honor-through-strength — showing mercy is considered weakness and invites social ridicule from peers." },
  { race: "Hobgoblin", text: "Hobgoblin Martial Training gives them proficiency in two martial weapons and light armor from birth — warriors by nature and by choice." },
  { race: "Hobgoblin", text: "The Hobgoblin deity Maglubiyet once defeated the goblin god Nomog-Geaya in combat, effectively enslaving the goblin race to Hobgoblin rule." },
  // Human
  { race: "Human", text: "Variant Humans are considered one of the strongest level-1 options in 5e — the only race that starts play with a free feat." },
  { race: "Human", text: "Humans have no innate magic — their extraordinary power comes entirely from ambition, adaptability, and the capacity to learn anything." },
  { race: "Human", text: "Humans reproduce and spread faster than any other playable race, making them the dominant population in nearly every D&D setting." },
  { race: "Human", text: "In Eberron, Humans founded the great Dragonmarked Houses — the most powerful economic and political forces on the entire continent." },
  { race: "Human", text: "Standard Humans gain +1 to every ability score — an unusually broad bonus that benefits any character build in any class." },
  // Kalashtar
  { race: "Kalashtar", text: "Kalashtar are humans merged with quori spirits — psychic beings from Dal Quor, the Region of Dreams, who fled their own plane." },
  { race: "Kalashtar", text: "Kalashtar cannot dream — their quori spirit dreams instead during rest, sharing visions from the plane of Dal Quor with the host." },
  { race: "Kalashtar", text: "Kalashtar share telepathic communication with any willing creature within 60 feet, transmitting concepts even across language barriers." },
  { race: "Kalashtar", text: "The quori within each Kalashtar fled from the Dreaming Dark — a totalitarian regime of nightmare quori that controls Dal Quor." },
  // Kender
  { race: "Kender", text: "Kender from the Dragonlance setting are halfling-sized wanderers who are constitutionally incapable of feeling fear — not by bravery, but by nature." },
  { race: "Kender", text: "Kender are infamous for 'handling' — their cultural term for picking up and examining any object they find interesting, regardless of ownership." },
  { race: "Kender", text: "In 5e's 'Dragonlance: Shadow of the Dragon Queen,' Kender have a Taunt ability that provokes enemies into focusing their attacks." },
  { race: "Kender", text: "A Kender's fearlessness is often mistaken for courage by other races — in truth, the concept of danger simply doesn't register for them." },
  // Kenku
  { race: "Kenku", text: "Kenku were once a winged race who could fly — their wings were taken as divine punishment for attempting to steal from their god." },
  { race: "Kenku", text: "Kenku cannot create new sounds — they can only perfectly mimic sounds and voices they have heard. They have no original voice of their own." },
  { race: "Kenku", text: "Kenku Expert Forgery allows them to duplicate any handwriting or craftwork perfectly after only a brief examination of the original." },
  { race: "Kenku", text: "In the Forgotten Realms, Kenku gravitate toward urban environments and criminal life — their mimicry makes them exceptional infiltrators and spies." },
  // Kobold
  { race: "Kobold", text: "Kobolds are the most numerous humanoid race in the Underdark — their vast tunneling networks undermine many underground civilizations." },
  { race: "Kobold", text: "Kobolds worship dragons above all gods — they genuinely believe themselves to be the chosen servants and distant kin of dragonkind." },
  { race: "Kobold", text: "Pack Tactics gives Kobolds advantage on attack rolls whenever an ally is adjacent to their target — they are deadliest in groups." },
  { race: "Kobold", text: "Despite their reputation for cowardice, Kobold engineers have designed traps that have killed more adventurers than most monsters." },
  // Leonin
  { race: "Leonin", text: "Leonin from the Theros setting are proud lion-folk who deeply distrust gods — having been abandoned by their deity, they trust only themselves." },
  { race: "Leonin", text: "Leonin are one of the only races in D&D that actively reject divine worship as a cultural value." },
  { race: "Leonin", text: "A Leonin's Daunting Roar can frighten multiple enemies simultaneously as a bonus action, sending weaker foes into panicked retreat." },
  // Lizardfolk
  { race: "Lizardfolk", text: "Lizardfolk are cold-blooded in every sense — they lack the emotional responses of warm-blooded races and process every situation with cold logic." },
  { race: "Lizardfolk", text: "Lizardfolk can hold their breath for up to 15 minutes, swim at full speed, and eat fallen enemies to regain temporary hit points." },
  { race: "Lizardfolk", text: "Lizardfolk view skull and scale trophies from defeated enemies as the highest form of wealth — worn proudly as jewelry and armor adornment." },
  { race: "Lizardfolk", text: "Lizardfolk culture has no concept of personal names in the common sense — they use scent-based identifiers that translate poorly into humanoid speech." },
  // Locathah
  { race: "Locathah", text: "Locathah were once enslaved by the Sahuagin — their entire civilization is defined by their history of liberation and fierce independence." },
  { race: "Locathah", text: "Locathah Leviathan Will gives them advantage against becoming charmed, frightened, paralyzed, poisoned, stunned, or unconscious all at once." },
  { race: "Locathah", text: "Locathah are perfectly amphibious — they breathe air and water equally well, and move at full speed in both environments." },
  // Lotusden Halfling
  { race: "Lotusden Halfling", text: "Lotusden Halflings from Wildemount's Lotusden Greenwood have an innate bond with the forest, able to cast Tree Stride at higher levels." },
  { race: "Lotusden Halfling", text: "Lotusden Halflings can cast Entangle as an innate spell, drawing on the deep root-magic of the ancient forest they call home." },
  { race: "Lotusden Halfling", text: "Unlike their city-dwelling cousins, Lotusden Halflings prefer deep wilderness — their communities are rarely found near roads or major settlements." },
  // Loxodon
  { race: "Loxodon", text: "Loxodon from Ravnica are elephant-folk whose trunks serve as a snorkel, an extra limb, a scent organ, and a surprisingly frightening horn." },
  { race: "Loxodon", text: "Loxodon Serenity gives them advantage on saves against being frightened or charmed — their placid nature is a genuine psychological fortress." },
  { race: "Loxodon", text: "A Loxodon's memory is legendary — they recall every face they've ever met and every sound they've ever heard, sometimes for centuries." },
  // Minotaur
  { race: "Minotaur", text: "Minotaurs have a perfect sense of direction and can always retrace their path — they literally cannot become lost in a maze." },
  { race: "Minotaur", text: "A Minotaur's Hammering Horns ability can push enemies back 10 feet after a melee hit — combining lethally with cliffs, pits, or fire." },
  { race: "Minotaur", text: "In Theros D&D lore, the first Minotaur was Asterion — born from divine intervention and doomed to wander the first labyrinth forever." },
  { race: "Minotaur", text: "Minotaur Goring Rush lets them make a bonus horn attack after using the Dash action — they fight better at a full charge than standing still." },
  // Orc
  { race: "Orc", text: "5e Orc player characters have Adrenaline Rush — they can Dash as a bonus action and gain temporary hit points, fueled by battle-rage." },
  { race: "Orc", text: "Orcs worship Gruumsh One-Eye, who lost his eye to the elf god Corellon Larethian — creating the eternal divine enmity between their races." },
  { race: "Orc", text: "In 2021, WotC revised the Orc race description to remove inherently evil racial traits, replacing them with the current neutral depiction." },
  { race: "Orc", text: "Orcs are one of the few races with innate proficiency in Intimidation — making them natural figures of authority through fear alone." },
  // Owlin
  { race: "Owlin", text: "Owlin flight is completely silent — they produce no sound whatsoever as they move through the air, making them ghostly aerial ambushers." },
  { race: "Owlin", text: "Owlin share the 120-foot darkvision range with Drow — tying for the longest dark sight of any core playable race." },
  { race: "Owlin", text: "An Owlin's Silent Feathers grants proficiency in Stealth — combined with silent flight, they are the most effectively stealthy flying race." },
  // Pallid Elf
  { race: "Pallid Elf", text: "Pallid Elves from Wildemount are pale, contemplative elves who are unnervingly attuned to the world beyond the veil of the living." },
  { race: "Pallid Elf", text: "Pallid Elves have innate access to Detect Thoughts and Uninvited Guests at higher levels — they have always half-existed in the spirit world." },
  { race: "Pallid Elf", text: "In the Wildemount setting, Pallid Elves emerged from the Pallid Grove — a forest so ancient that even the oldest surface elves do not remember its founding." },
  // Plasmoid
  { race: "Plasmoid", text: "Plasmoids are sentient ooze-beings from Spelljammer who can squeeze through any gap at least 1 inch wide — locks are irrelevant to them." },
  { race: "Plasmoid", text: "Plasmoids can form pseudopods up to 10 feet long, striking enemies without moving from their current position." },
  { race: "Plasmoid", text: "A Plasmoid has no fixed shape — over the course of a long rest, they can reform into a completely different-looking body, face included." },
  // Reborn
  { race: "Reborn", text: "Reborn are characters who died and returned to life — mortals resurrected by mysterious forces, carrying only fragments of their past self." },
  { race: "Reborn", text: "Despite looking like undead, Reborn are living creatures — they eat, breathe, and age, though much more slowly than normal mortals." },
  { race: "Reborn", text: "Reborn have Fading Memories — they can occasionally recall fragments of their previous life as flashes of insight relevant to the current situation." },
  // Satyr
  { race: "Satyr", text: "Satyrs have Magic Resistance — advantage on saving throws against all spells and magical effects — one of the most powerful racial traits in 5e." },
  { race: "Satyr", text: "Satyrs are fey creatures from Theros and the Feywild who are entirely immune to being put to sleep by magical means." },
  { race: "Satyr", text: "A Satyr's Ram ability lets them push enemies back 10 feet with their horns — combining devastatingly with a nearby cliff or open window." },
  // Sea Elf
  { race: "Sea Elf", text: "Sea Elf civilization in the Forgotten Realms predates any surface nation — their coral cities have stood for over 20,000 years." },
  { race: "Sea Elf", text: "Sea Elves can breathe water indefinitely and speak with any creature that breathes water as if casting Speak with Animals." },
  { race: "Sea Elf", text: "Sea Elf skin ranges from deep ocean blue to pale sea-green to pearl white — evolved to shimmer and blend with the ever-shifting water." },
  // Shadar-kai
  { race: "Shadar-kai", text: "Shadar-kai are elves transformed by centuries of service to the Raven Queen — their emotions slowly fade into grey numbness in the Shadowfell." },
  { race: "Shadar-kai", text: "Shadar-kai who stop seeking sensation — pain, pleasure, anything — gradually become wraiths, consumed by the Shadowfell's endless emptiness." },
  { race: "Shadar-kai", text: "A Shadar-kai's Blessing of the Raven Queen lets them teleport through shadow, emerging momentarily wreathed in dark tendrils of dusk." },
  // Shifter
  { race: "Shifter", text: "Shifters are descended from humans and lycanthropes — they partially manifest their beast aspect in moments of battle or strong emotion." },
  { race: "Shifter", text: "The four Shifter subraces each reflect a different beast heritage: Beasthide (bear), Longtooth (wolf), Swiftstride (cat), Wildhunt (predator)." },
  { race: "Shifter", text: "In Eberron, Shifters are called 'the weretouched' by other races and often face discrimination — blamed for events caused by full lycanthropes." },
  { race: "Shifter", text: "Shifting lasts for 1 minute and grants bonus hit points plus a unique benefit — once combat ends, the beast retreats back beneath the skin." },
  // Simic Hybrid
  { race: "Simic Hybrid", text: "Simic Hybrids are humanoids magically fused with aquatic creature traits by the Simic Combine guild of Ravnica — science, not sorcery." },
  { race: "Simic Hybrid", text: "At character creation and again at level 5, Simic Hybrids choose animal enhancements: manta glide, carapace, grappling appendages, and more." },
  { race: "Simic Hybrid", text: "The Simic Combine holds that all life should be free to evolve beyond its current form — Simic Hybrids are living proof of that philosophy." },
  // Tabaxi
  { race: "Tabaxi", text: "Tabaxi are cat-folk driven by insatiable curiosity — their Cat's Talent grants proficiency in both Perception and Stealth from the start." },
  { race: "Tabaxi", text: "Tabaxi Feline Agility allows them to move at double speed for one turn — making them the fastest sprinting race in a single burst." },
  { race: "Tabaxi", text: "Tabaxi come from a distant mysterious continent called Maztica — they travel as wandering collectors of stories, secrets, and curiosities." },
  { race: "Tabaxi", text: "Tabaxi names are poetic descriptions rather than proper nouns — names like 'Cloud on the Mountaintop' or 'Ember of the Burning Sky' are common." },
  // Thri-kreen
  { race: "Thri-kreen", text: "Thri-kreen do not sleep at all — they are fully active every hour of every day, giving them extra downtime to craft and study." },
  { race: "Thri-kreen", text: "Thri-kreen have four arms, allowing them to hold two shields, wield multiple weapons, or juggle items during conversation simultaneously." },
  { race: "Thri-kreen", text: "Thri-kreen communicate through mandible-clicks and pheromones — their natural telepathy lets them share concepts with creatures that have no language." },
  // Tiefling
  { race: "Tiefling", text: "Every Tiefling in the Forgotten Realms traces their infernal mark to a single ancient bargain made between Asmodeus and the empire of Netheril." },
  { race: "Tiefling", text: "Tiefling variants exist for each of the nine Archdevils — Zariel tieflings have bat wings; Glasya tieflings have innate invisibility." },
  { race: "Tiefling", text: "Tieflings in Faerûn endure deep prejudice — many hide their horns and tuck their tails to pass as human in less tolerant cities." },
  { race: "Tiefling", text: "The Hellish Rebuke spell, available to all Tieflings, allows them to curse attackers with fire damage — a reflex of infernal heritage." },
  { race: "Tiefling", text: "In the Planescape setting, Tieflings are extremely common in Sigil — the City of Doors — where being touched by the planes is unremarkable." },
  // Tortle
  { race: "Tortle", text: "Tortles begin the game with a natural Armor Class of 17 without any armor — one of the highest unarmored ACs available at level 1." },
  { race: "Tortle", text: "A Tortle can retreat entirely into their shell, gaining +4 AC and damage resistance while remaining immobile and purely defensive." },
  { race: "Tortle", text: "Tortles are born on beaches and spend the first weeks of their lives at sea — every Tortle begins their existence as a swimmer." },
  { race: "Tortle", text: "Tortle lifespans peak around 50 years — making them one of the shortest-lived playable races alongside Goblins and Kobolds." },
  // Triton
  { race: "Triton", text: "Tritons see themselves as noble guardians of the deep — sealing Abyssal threats beneath the waves that surface-dwellers never know existed." },
  { race: "Triton", text: "Triton culture is deeply formal and subtly condescending — they consider their self-sacrifice for an ungrateful surface world a point of profound pride." },
  { race: "Triton", text: "Tritons can control water, air currents, fog, and wind — their elemental connection to the ocean is as ancient as the sea itself." },
  // Vedalken
  { race: "Vedalken", text: "Vedalken are blue-skinned scholars from Ravnica who pursue perfection — their philosophy holds that flaws are merely unsolved problems." },
  { race: "Vedalken", text: "Vedalken Tireless Precision adds 1d4 to one chosen skill and one chosen tool — making them the most specialized specialists in the game." },
  { race: "Vedalken", text: "Vedalken experience a narrower emotional range than most races — their joy and sorrow are muted, but their analytical capability is without peer." },
  // Verdan
  { race: "Verdan", text: "Verdans are goblinoids transformed by Chaos magic into a new race — taller, greener, and empathic in ways their goblinoid cousins are not." },
  { race: "Verdan", text: "Verdan telepathy is involuntary — they constantly sense the emotions of nearby creatures and cannot turn it off, even when they want to." },
  { race: "Verdan", text: "Verdans can change their appearance dramatically as they age — growing taller, shifting pigment, or developing entirely new physical features." },
  // Warforged
  { race: "Warforged", text: "Warforged were built to fight in Eberron's Last War — when the war ended, they were left without purpose and without legal rights as citizens." },
  { race: "Warforged", text: "Warforged don't eat, breathe, or sleep — they enter 'rest mode' during long rests: aware of their surroundings but inactive." },
  { race: "Warforged", text: "Warforged Artificers can integrate tools directly into their body — an Artillerist can literally build a magical cannon into their chest." },
  { race: "Warforged", text: "The oldest Warforged are only about 30 years old — yet many carry the psychological weight of a lifetime of unending war." },
  { race: "Warforged", text: "A Warforged's body can be made of wood, metal, or stone — each material was originally chosen to match their military function." },
  // Wood Elf
  { race: "Wood Elf", text: "Wood Elves move at 35 feet per round — 5 feet faster than the standard — a reflection of a lifetime spent running through forest undergrowth." },
  { race: "Wood Elf", text: "Wood Elves can attempt to hide even when only lightly obscured by foliage, rain, or dim natural light — invisibility in plain sight." },
  { race: "Wood Elf", text: "Wood Elf culture values solitude and self-reliance — they rarely build permanent settlements, preferring seasonal migration through wild lands." },
  { race: "Wood Elf", text: "The Wood Elves of the Forgotten Realms trace their heritage to the ancient empire of Aryvandaar, a civilization torn apart by elven civil war." },
  // Yuan-ti Pureblood
  { race: "Yuan-ti Pureblood", text: "Yuan-ti Purebloods appear almost entirely human — only subtle serpentine features like slit pupils or scaled skin patches betray their true nature." },
  { race: "Yuan-ti Pureblood", text: "Yuan-ti are completely immune to all poison damage and the poisoned condition — a trait shared by no other core playable race." },
  { race: "Yuan-ti Pureblood", text: "Yuan-ti worship the serpent god Sseth (or Merrshaulk) through elaborate blood-rites that mirror the cruelty at the heart of their civilization." },
  { race: "Yuan-ti Pureblood", text: "Innate Spellcasting gives Yuan-ti Purebloods Animal Friendship (snakes only) at will, plus Suggestion and Fear as they grow in power." },
  // Cross-race / general facts
  { race: "D&D Lore", text: "The playable races in D&D have grown from just 5 options in 1974 — Human, Elf, Dwarf, Halfling, Half-Elf — to over 60 by 2024." },
  { race: "D&D Lore", text: "Flying races like Aarakocra and Fairy are banned at many tables — the ability to fly at level 1 bypasses enormous amounts of dungeon design." },
  { race: "D&D Lore", text: "Every D&D setting has a different set of 'common' races — Eberron features Warforged and Changelings; Theros has Leonin and Satyrs." },
  { race: "D&D Lore", text: "In 2022's 'Monsters of the Multiverse,' WotC unified all race stat blocks under one consistent format for the first time in 5e's history." },
  { race: "D&D Lore", text: "The Triton, Locathah, and Sea Elf are D&D's three dedicated aquatic playable races — each represents a distinct tier of ocean civilization." },
  { race: "D&D Lore", text: "Dragonmarks from the Eberron setting are magical tattoos that appear on specific races and grant spell-like abilities unique to each mark." },
  { race: "D&D Lore", text: "Goblinoids — Goblins, Bugbears, and Hobgoblins — share the same deity (Maglubiyet) and trace their lineage to a common ancestral people." },
  { race: "D&D Lore", text: "The term 'race' in D&D's 5.5e revision was officially changed to 'species' — though the majority of tables still use the original terminology." },
  { race: "D&D Lore", text: "The Hadozee, Giff, and Plasmoid are Spelljammer races — designed specifically for space-faring campaigns aboard magical ships between worlds." },
  { race: "D&D Lore", text: "Every Elf subrace — Drow, High Elf, Wood Elf, Sea Elf, Eladrin, and Shadar-kai — was once a single unified elven people in the ancient world." },
  { race: "D&D Lore", text: "Half-Elf and Half-Orc are the only 'half' races in the core rules — Half-Dragon and Half-Giant appear only in specific campaign settings." },
  { race: "D&D Lore", text: "Dwarves have the slowest base speed of any core race at 25 feet — but they are the only race whose speed is never reduced by armor." },
];

const CLASSES = ['Barbarian', 'Bard', 'Cleric', 'Druid', 'Fighter', 'Monk', 'Paladin', 'Ranger', 'Rogue', 'Sorcerer', 'Warlock', 'Wizard'];

interface WizardFormProps {
  mode: CharacterMode;
}

export default function WizardForm({ mode }: WizardFormProps) {
  const [, setLocation] = useLocation();
  const { saveCharacter } = useCharacters();
  const [step, setStep] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);

  const [name, setName] = useState('');
  const [quote] = useState<NameQuote>(() => NAME_QUOTES[Math.floor(Math.random() * NAME_QUOTES.length)]);
  const [race, setRace] = useState('');
  const [customRace, setCustomRace] = useState('');
  const [charClass, setCharClass] = useState('');
  const [personality, setPersonality] = useState('');
  const [powerLevel, setPowerLevel] = useState<PowerLevel>('Commoner');

  const effectiveRace = race === 'Other' ? customRace.trim() : race;

  const steps = [
    { title: "The Name", desc: "Who are you?" },
    { title: "Lineage", desc: "Choose your ancestry" },
    { title: "Calling", desc: "Choose your path" },
    { title: "Essence", desc: "Traits & Flaws" },
    ...(mode === 'npc' ? [{ title: "Might", desc: "Set power level" }] : []),
  ];

  const totalSteps = steps.length;

  const isNextDisabled =
    (step === 0 && !name) ||
    (step === 1 && (!race || (race === 'Other' && !customRace.trim()))) ||
    (step === 2 && !charClass) ||
    (step === 3 && !personality);

  const handleNext = () => {
    if (isNextDisabled) return;
    if (step < totalSteps - 1) {
      setStep(s => s + 1);
    } else {
      generateFinalCharacter();
    }
  };

  const generateFinalCharacter = async () => {
    setIsGenerating(true);
    await new Promise(r => setTimeout(r, 2000));

    const stats = generateStats(charClass, mode === 'npc' ? powerLevel : undefined);
    const backstory = generateBackstory(name, effectiveRace, charClass, personality);
    const portraitUrl = generatePortraitUrl(effectiveRace, charClass, personality);

    const newChar: Character = {
      id: Math.random().toString(36).substring(2, 9),
      mode,
      name,
      race: effectiveRace,
      charClass,
      personality,
      powerLevel: mode === 'npc' ? powerLevel : undefined,
      stats,
      backstory,
      portraitUrl,
      createdAt: Date.now()
    };

    saveCharacter(newChar);
    setLocation(`/sheet/${newChar.id}`);
  };

  const renderStepContent = () => {
    switch (step) {
      case 0:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8 px-2">
              <p className="text-muted-foreground text-base italic leading-relaxed mb-3">
                "{quote.text}"
              </p>
              <p className="text-primary/50 text-xs font-display tracking-wider">
                — {quote.source},{' '}
                <span className="italic">{quote.work}</span>{' '}
                ({quote.year})
              </p>
            </div>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Kaelen Shadowweaver"
              className="w-full bg-background border-2 border-primary/30 rounded-xl px-6 py-4 text-xl md:text-2xl font-display text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/20 transition-all text-center"
              autoFocus
              onKeyDown={(e) => e.key === 'Enter' && name && handleNext()}
            />
            <div className="flex justify-center pt-2">
              <D20Button onRoll={(generated) => setName(generated)} />
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-4 pb-8">
            <div className="grid grid-cols-2 gap-3">
              {RACES.map(r => (
                <button
                  key={r}
                  onClick={() => {
                    setRace(r);
                    if (r !== 'Other') setCustomRace('');
                  }}
                  className={cn(
                    "px-4 py-4 rounded-xl border-2 font-display tracking-wider text-sm transition-all duration-300 hover-elevate text-left",
                    race === r
                      ? "bg-primary/20 border-primary text-primary shadow-[0_0_15px_rgba(234,179,8,0.2)]"
                      : "bg-card border-border text-foreground hover:border-primary/50"
                  )}
                >
                  {r === 'Other' ? (
                    <span className="flex items-center gap-2">
                      <PenLine className="w-4 h-4 shrink-0" />
                      Other…
                    </span>
                  ) : r}
                </button>
              ))}
            </div>

            <AnimatePresence>
              {race === 'Other' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden"
                >
                  <div className="pt-2 pb-1">
                    <p className="text-muted-foreground text-sm italic mb-3 text-center">
                      Name your lineage — homebrew, lore-expansion, or legend of your own making.
                    </p>
                    <input
                      type="text"
                      value={customRace}
                      onChange={(e) => setCustomRace(e.target.value)}
                      placeholder="e.g. Duergar, Shadar-kai, Kenku hybrid…"
                      className="w-full bg-background border-2 border-primary/60 rounded-xl px-5 py-4 text-base font-display text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/20 transition-all text-center"
                      autoFocus
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );

      case 2:
        return (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 pb-8">
            {CLASSES.map(c => (
              <button
                key={c}
                onClick={() => setCharClass(c)}
                className={cn(
                  "px-3 py-4 rounded-xl border-2 font-display tracking-wider text-sm transition-all duration-300 hover-elevate",
                  charClass === c
                    ? "bg-primary/20 border-primary text-primary shadow-[0_0_15px_rgba(234,179,8,0.2)]"
                    : "bg-card border-border text-foreground hover:border-primary/50"
                )}
              >
                {c}
              </button>
            ))}
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <p className="text-muted-foreground text-center mb-4 italic">
              Describe their ideals, bonds, flaws, or general demeanor.
            </p>
            <textarea
              value={personality}
              onChange={(e) => setPersonality(e.target.value)}
              placeholder="A brooding wanderer who speaks to spirits, fiercely loyal to their coin purse but terrified of enclosed spaces..."
              className="w-full h-48 bg-background border-2 border-primary/30 rounded-xl px-5 py-4 text-base font-sans text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/20 transition-all resize-none"
            />
          </div>
        );

      case 4:
        return mode === 'npc' ? (
          <div className="space-y-12 pt-8 pb-4">
            <div className="flex justify-between px-2 text-sm font-display font-bold text-primary">
              <span>Commoner</span>
              <span>Elite</span>
              <span>Legendary</span>
            </div>
            <div className="relative w-full h-2 bg-secondary rounded-full">
              <input
                type="range"
                min="0"
                max="2"
                step="1"
                value={powerLevel === 'Commoner' ? 0 : powerLevel === 'Elite' ? 1 : 2}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  setPowerLevel(val === 0 ? 'Commoner' : val === 1 ? 'Elite' : 'Legendary');
                }}
                className="absolute inset-0 w-full opacity-0 cursor-pointer h-8 -top-3"
              />
              <div
                className="absolute h-full bg-primary rounded-full transition-all duration-300"
                style={{ width: `${powerLevel === 'Commoner' ? 0 : powerLevel === 'Elite' ? 50 : 100}%` }}
              />
              <div
                className="absolute top-1/2 -translate-y-1/2 w-6 h-6 bg-primary rounded-full shadow-[0_0_10px_rgba(234,179,8,0.5)] border-2 border-background transition-all duration-300 pointer-events-none"
                style={{ left: `calc(${powerLevel === 'Commoner' ? 0 : powerLevel === 'Elite' ? 50 : 100}% - 12px)` }}
              >
                <div className="absolute inset-1 border border-background/30 rounded-full" />
              </div>
            </div>

            <div className="text-center p-6 bg-card border border-primary/20 rounded-xl">
              <h3 className="text-xl font-display text-primary mb-2">{powerLevel}</h3>
              <p className="text-muted-foreground text-sm">
                {powerLevel === 'Commoner' && "Standard stats (8–12). Suitable for townsfolk, guards, or minor threats."}
                {powerLevel === 'Elite' && "Enhanced stats (14–18). Suitable for captains, veterans, or tough adversaries."}
                {powerLevel === 'Legendary' && "Godlike stats (20–24). Suitable for bosses, champions, or mythical figures."}
              </p>
            </div>
          </div>
        ) : null;

      default:
        return null;
    }
  };

  if (isGenerating) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center min-h-[60vh]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          className="w-32 h-32 relative mb-8"
        >
          <div className="absolute inset-0 border-4 border-t-primary border-r-primary border-b-primary/20 border-l-primary/20 rounded-full" />
          <div className="absolute inset-4 border-4 border-t-accent/20 border-r-accent/20 border-b-accent border-l-accent rounded-full" />
          <Sparkles className="absolute inset-0 m-auto w-12 h-12 text-primary animate-pulse" />
        </motion.div>
        <h2 className="text-3xl font-display font-bold text-primary mb-4">Weaving Fates...</h2>
        <p className="text-muted-foreground text-lg italic">
          Consulting the ancient tomes and conjuring visions of {name || 'the unknown'}...
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col pt-8 px-6 pb-20">
      <div className="w-full flex space-x-2 mb-8">
        {steps.map((_, i) => (
          <div
            key={i}
            className={cn(
              "h-1.5 flex-1 rounded-full transition-colors duration-500",
              i <= step ? "bg-primary shadow-[0_0_8px_rgba(234,179,8,0.5)]" : "bg-primary/20"
            )}
          />
        ))}
      </div>

      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-display font-bold text-primary text-glow mb-2">
          {steps[step].title}
        </h2>
        <p className="text-muted-foreground tracking-wide uppercase text-sm">
          {steps[step].desc}
        </p>
      </div>

      <div className="flex-1 relative overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="w-full"
          >
            {renderStepContent()}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex items-center justify-between pt-6 border-t border-primary/20 mt-auto">
        <Button
          variant="ghost"
          onClick={() => setStep(s => Math.max(0, s - 1))}
          className={cn("px-2", step === 0 && "opacity-0 pointer-events-none")}
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back
        </Button>

        <Button
          variant="default"
          onClick={handleNext}
          disabled={isNextDisabled}
          className="w-40 bg-gradient-to-r from-primary to-accent border-0 text-primary-foreground font-bold shadow-[0_0_15px_rgba(234,179,8,0.3)] hover:shadow-[0_0_25px_rgba(234,179,8,0.5)]"
        >
          {step === totalSteps - 1 ? (
            <>Forge <Wand2 className="w-5 h-5 ml-2" /></>
          ) : (
            <>Next <ArrowRight className="w-5 h-5 ml-2" /></>
          )}
        </Button>
      </div>
    </div>
  );
}
