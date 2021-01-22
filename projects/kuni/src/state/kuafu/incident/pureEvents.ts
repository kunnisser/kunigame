const events = {
  'fire': {
    name: '发生大火',
    condition: ['weather', 'season']
  },
  'flood': {
    name: '洪水滔天',
    condition: ['place', 'weather', 'season']
  },
  'war': {
    name: '外族入侵',
    condition: ['place', 'season']
  },
  'plague': {
    name: '瘟疫来袭',
    condition: ['weather', 'season', 'gdp']
  },
  'foison': {
    name: '粮食丰收',
    condition: ['season', 'place']
  },
  'confusion': {
    name: '城中市场混乱',
    condition: ['gdp']
  },
  'famine': {
    name: '发生饥荒，饿殍遍野。望各地商贩提供粮草..',
    condition: ['drought', 'season', 'place']
  },
  'drought': {
    name: '长时间的干旱，大地龟裂，颗粒无收..',
    condition: ['weather', 'season', 'place']
  }
}