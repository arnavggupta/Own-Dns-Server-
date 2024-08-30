const dgram = require('node:dgram');
const server = dgram.createSocket('udp4');
const dnsPacket= require("dns-packet");
const db={
    'www.google.com':{
        type:'A',
        data:'1.2.3.4'
    },
    'www.facebook.com':{
        type:'CNAME',
        data:'5.67.7.8'
    }

}
server.on('message',(msg,rinfo)=>{
   const decodedmsg= dnsPacket.decode(msg);
   const ipfromdb= db[decodedmsg.questions[0].name];
const ans=dnsPacket.encode({
    type:'response',
    id:decodedmsg.id,
    flags:33152,
    questions:decodedmsg.questions,
    answers:[{
        type:ipfromdb.type,
        name:decodedmsg.questions[0].name,
        ttl:600,
        data:ipfromdb.data
    }]
})


server.send(ans,rinfo.port,rinfo.address);
})

server.bind(53,()=>{
    console.log('Server is started at port 53');
})

