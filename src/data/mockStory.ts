export interface StoryChoice {
  text: string;
  nextNodeId: string;
  statRequirement?: {
    stat: "knowledge" | "courage" | "creativity" | "luck";
    value: number;
    failureNodeId: string;
    failureText: string;
  };
  statReward?: {
    stat: "knowledge" | "courage" | "creativity" | "luck";
    value: number;
  };
  itemRequirement?: string;
  itemReward?: string;
  logText: string;
}

export interface StoryNode {
  id: string;
  title: string;
  description: string;
  choices: StoryChoice[];
  companionComment?: string;
  worldEvent?: string;
  isEnding?: boolean;
  endingId?: string; // Links to endings.ts
  x: number; // visual coordinates for PortalMap rendering (0 to 100)
  y: number; // visual coordinates for PortalMap rendering (0 to 100)
}

export const predefinedStories: Record<string, StoryNode[]> = {
  "hollow-archives": [
    {
      id: "hollow-archives-start",
      title: "The Whispering Foyer",
      description: "You cross the doorway into the Hollow Archives. Infinite bookshelves scale upwards, folding over each other like paper geometry. In the center, a monumental hourglass bleeds sand. A Sarcastic Raven sits on a bronze banister, preening its pitch-black feathers.",
      companionComment: "'Oh great, another mortal seeking books. Try not to trigger the silent ward spells or we both end up as bookmarks.'",
      worldEvent: "The floor beneath you trembles as the library re-aligns itself.",
      x: 10,
      y: 50,
      choices: [
        {
          text: "Intimidate physical wards and scale the Shifting Staircase.",
          nextNodeId: "hollow-archives-climb",
          statRequirement: {
            stat: "courage",
            value: 4,
            failureNodeId: "hollow-archives-trip",
            failureText: "You try to scale the fast-shifting stairs but lose your footing, tumbling back down."
          },
          statReward: { stat: "courage", value: 1 },
          logText: "You bravely chose to conquer the shifting stairs directly."
        },
        {
          text: "Decipher the Runic Desk layout with historical clues.",
          nextNodeId: "hollow-archives-desk",
          statRequirement: {
            stat: "knowledge",
            value: 4,
            failureNodeId: "hollow-archives-clueless",
            failureText: "The runes blur together. You cannot make any sense of the library index."
          },
          statReward: { stat: "knowledge", value: 1 },
          logText: "You investigated the ancient runic library desk index."
        },
        {
          text: "Pursue a playful wisp of violet light hovering nearby.",
          nextNodeId: "hollow-archives-light",
          statReward: { stat: "creativity", value: 1 },
          logText: "You chose to trust your gut and followed the dancing wisp."
        }
      ]
    },
    {
      id: "hollow-archives-trip",
      title: "Bruised Ambition",
      description: "The stairs snap and retract like wooden keys in a locked chest. You tumble into a pile of dusty parchment rolls, safe but dizzy. The raven cackles from a higher ledge.",
      companionComment: "'Oh champion, you fall beautifully! Like an anvil falling into a marsh!'",
      x: 25,
      y: 20,
      choices: [
        {
          text: "Recover and try the Runic Desk index instead.",
          nextNodeId: "hollow-archives-desk",
          logText: "You swallowed your pride and approached the desk."
        },
        {
          text: "Examine the parchment pile you landed in.",
          nextNodeId: "hollow-archives-light",
          itemReward: "Dusty Scroll Fragment",
          logText: "You found a curious scroll remnant among the trash."
        }
      ]
    },
    {
      id: "hollow-archives-clueless",
      title: "Lost in Translation",
      description: "The characters seem to actively scramble. You feel a psychic tingle behind your temples — the records are protected by an active illusion spell.",
      companionComment: "'They don't teach ancient ciphering in the outer world, do they?'",
      x: 25,
      y: 80,
      choices: [
        {
          text: "Bypassing the spell, run up the shifting stairs anyway.",
          nextNodeId: "hollow-archives-climb",
          logText: "Determined, you ignored the static desk and bolted upstairs."
        },
        {
          text: "Wander down the darkened western hallway instead.",
          nextNodeId: "hollow-archives-light",
          logText: "You left the lobby in search of another lead."
        }
      ]
    },
    {
      id: "hollow-archives-climb",
      title: "The Shifting Staircase",
      description: "You climb high above the mist. Thousands of volumes spin in orbit around a giant astrolabe in the ceiling. A gold-embossed desk lies in wait, protected by a silent security ward.",
      companionComment: "'That astrolabe marks the alignment of the Codex of Midnight. Be careful with those lock clamps!'",
      x: 40,
      y: 30,
      choices: [
        {
          text: "Analyze the astrolabe dial using your Map Fragment.",
          nextNodeId: "hollow-archives-reliquary",
          itemRequirement: "Map Fragment",
          statReward: { stat: "knowledge", value: 2 },
          logText: "You used your Map Fragment to align the celestial astrolabe."
        },
        {
          text: "Leap across onto a swinging oak bookcase.",
          nextNodeId: "hollow-archives-jump",
          statRequirement: {
            stat: "luck",
            value: 3,
            failureNodeId: "hollow-archives-fall",
            failureText: "A sudden draft swings the bookshelf away. You slide down the wooden framing."
          },
          statReward: { stat: "luck", value: 1 },
          logText: "You performed a daring leap of faith across the chasm."
        },
        {
          text: "Descent back to inspect the runic library console.",
          nextNodeId: "hollow-archives-desk",
          logText: "You retreated to the safety of the main floor index."
        }
      ]
    },
    {
      id: "hollow-archives-desk",
      title: "The Scholar's Console",
      description: "Dust drifts like golden glitter in the cold air. The console has several hidden sliders, and a lead lockbox is welded to the framework.",
      companionComment: "'There is something clockwork inside that box. Do not hammer it!'",
      x: 40,
      y: 60,
      choices: [
        {
          text: "Pick the brass locking mechanism with lockpicks.",
          nextNodeId: "hollow-archives-drawer",
          statRequirement: {
            stat: "creativity",
            value: 4,
            failureNodeId: "hollow-archives-light",
            failureText: "You jam the lock pins. A loud bell rings and noxious violet vapor forces you to flee."
          },
          itemReward: "Celestial Key",
          logText: "You skillfully picked the box locked with clockwork."
        },
        {
          text: "Use your Bronze Key on the terminal bypass drawer.",
          nextNodeId: "hollow-archives-drawer",
          itemRequirement: "Bronze Key",
          itemReward: "Codex Coordinates",
          logText: "The heavy Bronze Key clicked perfectly in the bypass slide."
        },
        {
          text: "Read the historical logs embedded on the stone pillars.",
          nextNodeId: "hollow-archives-script",
          statReward: { stat: "knowledge", value: 1 },
          logText: "You spent vital minutes reading the forgotten stone records."
        }
      ]
    },
    {
      id: "hollow-archives-light",
      title: "The Haunted Aisle",
      description: "The violet light floats down a long, narrow aisle of restricted history books. You hear the rhythmic scratching of claws on stone from the shadows behind you.",
      companionComment: "'The Archivist is awake! Run, or stay silent as dead stone!'",
      x: 40,
      y: 85,
      choices: [
        {
          text: "Throw your Ancient Compass to distract the creeping claws.",
          nextNodeId: "hollow-archives-distort",
          itemRequirement: "Ancient Compass",
          logText: "You sacrificed the compass to lure the creature away."
        },
        {
          text: "Attempt to catch the glowing wisp with creative hands.",
          nextNodeId: "hollow-archives-catch",
          statRequirement: {
            stat: "creativity",
            value: 5,
            failureNodeId: "hollow-archives-trap",
            failureText: "The wisp bursts, blinding you. You stumble directly into a static magic trap."
          },
          logText: "You playfully tried to shape the magic wisp with your fingers."
        }
      ]
    },
    {
      id: "hollow-archives-reliquary",
      title: "The Radiant Astrolabe",
      description: "The gears of the astrolabe click together into a solid alignment ring. A brilliant flash of gold rays erupts from the central lens, offering the legendary Codex of Midnight perfectly open on an altar.",
      companionComment: "'By the stars, you actually did it. Take it and run before the dimension shatters!'",
      x: 75,
      y: 15,
      choices: [
        {
          text: "Grab the Codex and jump through the Golden Portal!",
          nextNodeId: "hollow-archives-ending-victory",
          logText: "You seized the golden book and leapt into the portal."
        }
      ]
    },
    {
      id: "hollow-archives-jump",
      title: "The Book Thief's Ledge",
      description: "You land on a velvet-padded shelf that immediately slides down a steel cable. It drops you right onto the high balcony of the Forbidden Sanctuary. The legendary Codex lies three feet away.",
      companionComment: "'Well, that was incredibly lucky. No broken bones either!'",
      x: 75,
      y: 35,
      choices: [
        {
          text: "Acquire the Codex and manifest your escape portal.",
          nextNodeId: "hollow-archives-ending-victory",
          logText: "You secured your destiny and initiated the portal warp."
        }
      ]
    },
    {
      id: "hollow-archives-drawer",
      title: "The Compass Vault",
      description: "A secret compartment slides open, revealing a detailed leather logbook. It contains the coordinate cyphers. The entire floor rotates, aligning with a massive hidden chamber behind the center clock.",
      companionComment: "'Excellent work. The vault path is clear! Go!'",
      x: 75,
      y: 55,
      choices: [
        {
          text: "Inscribe the coordinates to release the glowing Codex.",
          nextNodeId: "hollow-archives-ending-victory",
          logText: "You dialed in the geometric locks, materializing the gate."
        }
      ]
    },
    {
      id: "hollow-archives-script",
      title: "Ancient Warnings",
      description: "You learn that the library is not a storage unit, but a living prison. The manuscripts hold chaotic entities. The scratching shadows get closer, forming a humanoid silhouette made entirely of torn book pages.",
      companionComment: "'They are the scrap-souls of failed readers! We need to leave, NOW!'",
      x: 75,
      y: 75,
      choices: [
        {
          text: "Encircle yourself with protective chalk runes.",
          nextNodeId: "hollow-archives-ending-mystery",
          logText: "You sat down and activated a warding barrier of light."
        },
        {
          text: "Sprint straight for the center light core.",
          nextNodeId: "hollow-archives-ending-victory",
          logText: "You charged past the book beast into the glowing portal."
        }
      ]
    },
    {
      id: "hollow-archives-distort",
      title: "The Shard Passage",
      description: "The scratcher beast rushes towards the magnetic humming lines of your discarded compass. It gives you a narrow moment to secure the core and activate the escape mechanism.",
      companionComment: "'A smart trade. Better standard tools lost than our heads!'",
      x: 90,
      y: 40,
      choices: [
        {
          text: "Warp out before the beast realizes it has been duped.",
          nextNodeId: "hollow-archives-ending-victory",
          logText: "You rushed into the swirling pool of lilac fire."
        }
      ]
    },
    {
      id: "hollow-archives-catch",
      title: "Wisp's Grace",
      description: "To your surprise, the wisp is a pocket vortex that opens a direct dimensional rift. It shows you the target book suspended in white light.",
      companionComment: "'Well... I guess the cosmos has a favoritism streak!'",
      x: 90,
      y: 65,
      choices: [
        {
          text: "Reach in to grab the Codex.",
          nextNodeId: "hollow-archives-ending-victory",
          logText: "You reached into the pure rift light."
        }
      ]
    },
    {
      id: "hollow-archives-fall",
      title: "The Bottomless Shallows",
      description: "You fall. The books rush past your face. The raven dives and catches you by your cloak, dragging you onto a dark wooden platform. The platform is slowly shrinking.",
      companionComment: "'My wings are burning! Grab that portal handle on the ceiling!'",
      x: 55,
      y: 35,
      choices: [
        {
          text: "Activate your escape rift with Creativity and Luck.",
          nextNodeId: "hollow-archives-ending-sacrifice",
          logText: "You fused the magical energy variables together, hoping for a return."
        }
      ]
    },
    {
      id: "hollow-archives-trap",
      title: "Bound by Ink",
      description: "The runic sigils beneath you flash red. Iron-like bindings made of black liquid ink envelope your legs, cementing you to the stone vault floors.",
      companionComment: "'The ink traps are unbreakable without a royal guild seal...'",
      x: 55,
      y: 95,
      choices: [
        {
          text: "Surrender your mind to the library's shared history.",
          nextNodeId: "hollow-archives-ending-trap",
          logText: "You shut your eyes as the ink covered your neck."
        }
      ]
    },

    // Endings Nodes
    {
      id: "hollow-archives-ending-victory",
      title: "The Portal Restored",
      description: "With the Codex of Midnight nestled firmly under your arm, you plunge into the starry vacuum of the returning gate. The layout of the library folds behind you like an origami crane, leaving you safe in the Great Keep.",
      isEnding: true,
      endingId: "ha-ending-victory",
      x: 98,
      y: 30,
      choices: []
    },
    {
      id: "hollow-archives-ending-mystery",
      title: "The Eternal Archivist",
      description: "You ward yourself with the runes. The creatures cannot pierce the light, but neither can you leave. Over decades of quiet, you read every shelf, slowly morphing into a guardian of paper and lore.",
      isEnding: true,
      endingId: "ha-ending-mystery",
      x: 98,
      y: 55,
      choices: []
    },
    {
      id: "hollow-archives-ending-sacrifice",
      title: "Fading Echoes",
      description: "Your magic rift breaks the coordinates but leaves your equipment scattered. You return home safely, but the Hollow Archives disappear forever, leaving you wonder if you did enough.",
      isEnding: true,
      endingId: "ha-ending-sacrifice",
      x: 98,
      y: 75,
      choices: []
    },
    {
      id: "hollow-archives-ending-trap",
      title: "The Inked Scroll",
      description: "You are absorbed completely. Your physical form becomes a beautiful blueprint sketch in the margins of a musty manuscript, waiting for the next brave pioneer to trace your outline.",
      isEnding: true,
      endingId: "ha-ending-trap",
      x: 98,
      y: 90,
      choices: []
    }
  ],

  // Predefined story for The Phishing Kingdom (Educational story about cyber security themes wrapped in fantasy)
  "phishing-kingdom": [
    {
      id: "phishing-kingdom-start",
      title: "The Castle Firewalls",
      description: "You enter the Digital Realm of Raven-Nets. An elegant messenger bird delivers a gold-sealed scroll with a glowing seal of the Royal Treasury. The Wise Digital Sprite Sylas flashes yellow, scanning the text code.",
      companionComment: "'Caution: appearances can be deceptive here. Never trust a crown that hasn't been verified by the scroll signature.'",
      worldEvent: "A suspicious cloud of green binary smoke rises from the eastern towers.",
      x: 10,
      y: 50,
      choices: [
        {
          text: "Examine the parchment certificate using the Loupe of Truth.",
          nextNodeId: "phishing-kingdom-loupe",
          statRequirement: {
            stat: "knowledge",
            value: 4,
            failureNodeId: "phishing-kingdom-accept",
            failureText: "You fail to isolate the forgery details and decide to accept the mail."
          },
          statReward: { stat: "knowledge", value: 1 },
          logText: "You carefully verified the sender's royal crest structure."
        },
        {
          text: "Sign the secure ledger with your Royal Signet anyway to claim the treasure.",
          nextNodeId: "phishing-kingdom-scam",
          logText: "You blindly signed the decree to claim the gold."
        }
      ]
    },
    {
      id: "phishing-kingdom-loupe",
      title: "Unveiling the Mimic",
      description: "Under the glass of the Loupe, the royal signature reveals spelling mistakes: 'Trarsury' instead of 'Treasury'. It is a mimic seal designed to steal your credentials!",
      companionComment: "'I knew it! The Lord of Scams is behind this. Let's trace their raven back to its cage.'",
      x: 45,
      y: 30,
      choices: [
        {
          text: "Trace the sender's magical network route.",
          nextNodeId: "phishing-kingdom-trace",
          statReward: { stat: "creativity", value: 2 },
          logText: "You decided to trace the scam message back to its source."
        },
        {
          text: "Burn the fraudulent decree immediately.",
          nextNodeId: "phishing-kingdom-burn",
          logText: "You safely incinerated the fraudulent letter."
        }
      ]
    },
    {
      id: "phishing-kingdom-scam",
      title: "Curse of the Mimic Sigil",
      description: "As your signet stamp hits the clay, the seal turns into a parasitic slug. It drains your memory bytes, locking away your spellcraft. Sylas cries out as your luck drops.",
      companionComment: "'Ah! Your private keys are leaking! Quick, close the emergency runes!'",
      x: 45,
      y: 70,
      choices: [
        {
          text: "Evacuate your mind's core assets with a Warning Scroll.",
          nextNodeId: "phishing-kingdom-trace",
          itemRequirement: "Warning Scroll",
          logText: "You used your emergency Warning Scroll to purge the venom."
        },
        {
          text: "Try to counter-hack the slug with pure creativity.",
          nextNodeId: "phishing-kingdom-scam-trap",
          statRequirement: {
            stat: "creativity",
            value: 5,
            failureNodeId: "phishing-kingdom-ending-scammed",
            failureText: "Your calculations are scrambled. The curse locks you out of your memory vault."
          },
          logText: "You attempted a dangerous psychic counterattack."
        }
      ]
    },
    {
      id: "phishing-kingdom-trace",
      title: "The Den of Forgers",
      description: "You follow the coordinate signals into an overgrown mossy bunker. Computer-like crystals glow green. A hooded illusionist is compiling multiple fake messages. Sylas signals a strike opportunity.",
      companionComment: "'The Deceiver is distracted! Use your courage to trap them in their own spell!'",
      x: 75,
      y: 35,
      choices: [
        {
          text: "Confront the illusionist and invoke the Royal Firewall.",
          nextNodeId: "phishing-kingdom-ending-victory",
          statRequirement: {
            stat: "courage",
            value: 4,
            failureNodeId: "phishing-kingdom-ending-scammed",
            failureText: "You hesitate. They summon a network troll which overpowers you."
          },
          logText: "You bravely cornered the trickster in their own workshop."
        }
      ]
    },
    {
      id: "phishing-kingdom-burn",
      title: "The Safe Fortress",
      description: "The ashes disintegrate safely. You report the anomaly to the Royal Mage Guild, fortifying the castle gates against similar attempts. You have survived the test of deceit.",
      companionComment: "'A safe traveler arrives at their destination. A wise strategy!'",
      x: 75,
      y: 65,
      choices: [
        {
          text: "Receive the Guild's Gold Crest of Sanctity.",
          nextNodeId: "phishing-kingdom-ending-victory",
          logText: "You accepted the honor of the Kingdom Protection Shield."
        }
      ]
    },
    {
      id: "phishing-kingdom-scam-trap",
      title: "Decoupled Trap",
      description: "You separate the curse from your brain, tracking it back to its database core! They didn't anticipate your high intelligence.",
      companionComment: "'Wow, that was a dangerously advanced counter-measure! Let's shut them down.'",
      x: 75,
      y: 90,
      choices: [
        {
          text: "Shatter the scam crystal and purge the raven-net.",
          nextNodeId: "phishing-kingdom-ending-victory",
          logText: "You cleansed the entire digital realm of deceit."
        }
      ]
    },

    // Endings Nodes
    {
      id: "phishing-kingdom-ending-victory",
      title: "Hero of the Digital Realm",
      description: "You have locked down the kingdom's communication line. The trickster is imprisoned in a secure vault, and royal birds fly safely across a clean, authenticated raven-net under your watch.",
      isEnding: true,
      endingId: "pk-ending-victory",
      x: 98,
      y: 30,
      choices: []
    },
    {
      id: "phishing-kingdom-ending-scammed",
      title: "The Blocked Gate",
      description: "You lose your credentials. Locked out of your own spellbook, you are cast out as an unverified visitor, left to wander the digital outer lanes as a warns to other careless wizards.",
      isEnding: true,
      endingId: "pk-ending-scammed",
      x: 98,
      y: 70,
      choices: []
    }
  ]
};
