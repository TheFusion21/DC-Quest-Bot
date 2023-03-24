module.exports.users = (sequelize, DataTypes) => {
  return sequelize.define('users', {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    guildId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    discordId: {
      type: DataTypes.STRING(32),
      allowNull: false,
    },
    balance: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  }, {
    timestamps: false,
  });
};
module.exports.games = (sequelize, DataTypes) => {
  return sequelize.define('games', {
    name: {
      type: DataTypes.STRING(127),
      allowNull: false,
    },
    label: {
      type: DataTypes.STRING(127),
      allowNull: false,
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
  }, {
    timestamps: false,
  });
};
module.exports.events = (sequelize, DataTypes) => {
  return sequelize.define('events', {
    guildId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    gameId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING(2048),
      allowNull: true,
      defaultValue: null,
    },
    startTime: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    endTime: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    creatorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    reward: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  }, {
    timestamps: false,
  });
};
module.exports.userquests = (sequelize, DataTypes) => {
  return sequelize.define('userquests', {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    questId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: DataTypes.TINYINT,
      allowNull: false,
    },
    progress: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  }, {
    timestamps: false,
  });
};
module.exports.quests = (sequelize, DataTypes) => {
  return sequelize.define('quests', {
  // 0 = daily, 1 = weekly, 2 = permanent
    type: {
      type: DataTypes.TINYINT,
      allowNull: false,
    },
    gameId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING(2048),
      allowNull: false,
    },
    reward: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    limit: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  }, {
    timestamps: false,
  });
};
module.exports.questTemplates = (sequelize, DataTypes) => {
  return sequelize.define('questTemplates', {
    type: {
      type: DataTypes.TINYINT,
      allowNull: false,
    },
    gameId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING(2048),
      allowNull: false,
    },
    reward: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    limit: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  }, {
    timestamps: false,
  });
};
module.exports.userachievements = (sequelize, DataTypes) => {
  return sequelize.define('userachievements', {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    achievementId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    achievedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  }, {
    timestamps: false,
  });
};
module.exports.achievements = (sequelize, DataTypes) => {
  return sequelize.define('achievements', {
    name: {
      type: DataTypes.STRING(127),
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING(2048),
      allowNull: false,
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    gameId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  }, {
    timestamps: false,
  });
};

module.exports.guilds = (sequelize, DataTypes) => {
  return sequelize.define('guilds', {
    guildId: {
      type: DataTypes.STRING(32),
      allowNull: false,
    },
    announcementChannelId: {
      type: DataTypes.STRING(32),
      allowNull: true,
      defaultValue: null,
    },
  }, {
    timestamps: false,
  });
};