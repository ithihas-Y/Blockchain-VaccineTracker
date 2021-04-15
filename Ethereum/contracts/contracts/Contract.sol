// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.0;
pragma experimental ABIEncoderV2;

contract VaccineTracker{
    struct Vaccine{
        string Name;
        string Manufacturer;
        uint256 ID;
        uint32 ExpDate;
        bool initialised;
        bool Assigned;
        address CurrentDistributor;
        int32 locationLatitude;
        int32 locationLongitude;
        int8 Temp;
        uint256 EndUserID;
    }
    
    struct Distributor{
        string Name; 
        bool authorised;
        address ID;
    }
    
    struct Location{
        int32 Latitude;
        int32 Longitude;
    }
    
    event locationUpdated(Location[]);
    
    address payable _owner;
    uint256[] VIDs;
    uint256 public Vcount; 
    
    mapping(uint256 => Vaccine) public details;
    mapping(uint256 =>Distributor[]) public EndPoints;
    mapping(address =>Distributor) public Authdistributors;
    mapping(uint256 => Location[]) public history;
    mapping(address => uint256[]) public inventory;
    
    constructor(){
        _owner = payable(msg.sender);
        Vcount =0;
    }
    
    modifier OnlyOwner{
        require(msg.sender == _owner);
        _;
    }
    
    modifier OnlyDistributor{
        require(Authdistributors[msg.sender].authorised == true);
        _;
    }
    
    function setDistributor(address did,string memory name) public OnlyOwner{
        Authdistributors[did].Name = name;
        Authdistributors[did].ID = did;
        Authdistributors[did].authorised = true;
    }
    
    function transferStock(uint32 amt,address receiver,string memory name) public OnlyDistributor{
        if(amt <= inventory[msg.sender].length && amt != 0){
            uint count = 0;
            
            while(count < amt){
                details[inventory[msg.sender][inventory[msg.sender].length-1]].CurrentDistributor = receiver;
                if(Authdistributors[receiver].authorised){
                    EndPoints[inventory[msg.sender][inventory[msg.sender].length-1]].push(Authdistributors[receiver]);
                }else{
                    EndPoints[inventory[msg.sender][inventory[msg.sender].length-1]].push(Distributor(name,false,receiver));
                }
                inventory[receiver].push(inventory[msg.sender][inventory[msg.sender].length-1]);
                inventory[msg.sender].pop();
                count++;
            }
        }else revert();
        
    }
    
    
    function fireDistributor(address Did) public OnlyOwner{
        Authdistributors[Did].authorised = false;
    }
    
    function setVaccine(string memory name,string memory manufacturer,uint256 id,uint32 expDate,
    int32 lat,int32 long,int8 temp)
    public {
        if(!details[id].initialised){
            Vcount++;
            details[id] = Vaccine(name,manufacturer,id,expDate,true,false,msg.sender,lat,long,temp,0);
            VIDs.push(id);
            history[id].push(Location(lat,long));
            EndPoints[id].push(Authdistributors[msg.sender]);
        }else{revert();}
    }
    
    function travelHistory(uint256 idd)  public view returns(Location[] memory) {
        return history[idd];
    }
    
    function updateLocation(uint256 VID,int32 newlat,int32 newlong) public{
        history[VID].push(Location(newlat,newlong));
    }
    
    function RequestVaccine(uint256 quantity) public OnlyDistributor returns(uint[] memory){
        if(quantity <= Vcount){
            uint256 count =0;
            for(uint256 i=0;i < VIDs.length-1;i++){
                while(count < quantity){
                    if(!details[VIDs[i]].Assigned){
                        details[VIDs[i]].Assigned = true;
                        details[VIDs[i]].CurrentDistributor = msg.sender;
                        inventory[msg.sender].push(details[VIDs[i]].ID);
                        EndPoints[VIDs[i]].push(Authdistributors[msg.sender]);
                        count++;
                        Vcount--;
                    }
                    else{
                        i++;
                    }
                }
                }
        }else revert();
        return inventory[msg.sender];
    }
    
    function getEndPoints(uint256 id) public view returns(Distributor[] memory){
        return EndPoints[id];
    }

    function getVaccines() public view returns(uint256[] memory){
        return VIDs;
    }
    
    function returnInventory(address Aid) public view returns (uint256[] memory){
        return inventory[Aid];
    }
    
    
    function withdraw() public payable OnlyOwner{
        _owner.transfer(address(this).balance);
    }
    
}