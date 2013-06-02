var igeConfig = {
	include: [
		{name: 'ServerNetworkEvents', path: './gameClasses/ServerNetworkEvents'}
	],
    db: {
        type: 'mongo',
        host: 'localhost',
        user: '',
        pass: '',
        dbName: 'supFarm'
    }
};

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = igeConfig; }