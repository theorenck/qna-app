const blacklist = [
    '_idlePrev',
    '_idleNext', 
    '_session', 
    'stream_server', 
    'open_sockets', 
    '_meteorSession', 
    '_handles', 
    '_multiplexer', 
    '_observeMultiplexers', 
    '_observeDriver', 
    '_mongoHandle', 
    's', 
    'sessionPool', 
    'topology', 
    '_docFetcher', 
    '_mongoConnection', 
    '_db', 
    'db', 
    'baseModel', 
    '_actBridge', 
    'orch',
    '_bridges',
    'accessorManager',
    'manager'
];

export const JSONReplacer = (k, v) => blacklist.indexOf(k) === -1 ? v : undefined;