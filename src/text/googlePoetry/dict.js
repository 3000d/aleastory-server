module.exports = [
  {
    type: 'simple',
    words: [
      'Ma copine', 'Ma copine ne',
      'Mon copain', 'Mon copain ne',
      'Ma femme', 'Ma femme ne',
      'Mon mari', 'Mon mari ne',
      'Est-ce que', 'Pourquoi', 'Je ne veux plus',
      'Je me souviens', 'Il se souvient', 'Elle se souvient',
      'Je suis u', 'Je suis l', 'Pourquoi l', 'Pourquoi j',
      'Aujourd\'hui je p', 'que faire quand',
      'j\'ai un petit'
    ]
  },
  {
    type: 'sentence',
    words: [
      [
        'Je me', 'elle est', 'il est', 'je suis', 'Pourquoi',
        'Aujourd\'hui je', 'Demain je', 'elle ne', 'il ne', 'je ne',
        'avoir peur de', 'que faire quand', 'comment arrêter'
      ],
      'abcdefghijklmnopqrstuvwxyz'.split(''),
    ]
  },
  //{
  //  type: 'question',
  //  question: 'est-ce que',
  //  words: [
  //    'la vie',
  //    'la mort',
  //  ]
  //},
  {
    type: 'question',
    question: 'Pourquoi',
    words: [
      'suis-je',
      'ai-je',
      'vais-je',
      "il n'y a",
      'y a-t-il',
    ]
  },
  {
    type: 'sentence',
    words: [
      [
        "j'aime", "il aime", "elle aime",
        "j'aimais", "il aimait", "elle aimait",
        "j'aimerais", "il aimerait", "elle aimerait",
        "je n'aime pas", "il n'aime pas", "elle n'aime pas",
      ],
      [
        'que',
        'quand',
        'pour'
      ]
    ]
  },
  {
    type: 'sentence',
    words: [
      [
        "j'ai peur", "il a peur", "elle a peur",
        "je pleure", "il pleure", "elle pleure"
      ],
      [
        'que',
        'quand',
        'de',
        'avec',
        'sans'
      ]
    ]
  }
];