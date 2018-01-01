var feature={
base:[
  {name:"create",cmd:/^(-create)|(--create)$/g},
  {name:"remove",cmd:/^(-remove)|(--remove)$/g},
  {name:"store",cmd:/^(-store)|(--store)$/g},
  {name:"link",cmd:/^(-link)|(--link)$/g},
  {name:"unlink",cmd:/^(-unlink)|(--unlink)$/g},
  {name:"install",cmd:/^(-install)|(--install)$/g}
],
config:[
    {name:"config",cmd:/^(-config)|(--config)$/g}
],
extra:[
  {name:"clean",cmd:/(-clean)|(--clean)/g},
  { name: "cleanall", cmd: /(-cleanall)|(--cleanall)/g },
  { name: "listall", cmd: /(-listall)|(--listall)/g },
  { name: "list", cmd: /(-list)|(--list)/g },
  { name: "pull", cmd: /(-pull)|(--pull)/g }
]

};



module.exports=feature;
