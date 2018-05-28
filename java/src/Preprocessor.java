import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.reflect.TypeToken;
import wrappers.NaivePacket;

import java.io.*;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.stream.Collectors;

public class Preprocessor {
    File input;

    public Preprocessor(String filename) throws FileNotFoundException{
        input = new File(filename);
    }

    public void parse() throws IOException {
        GsonBuilder builder = new GsonBuilder();
        builder.registerTypeAdapter(NaivePacket.class, new PacketDeserializer());
        Gson parser = builder.create();
        ArrayList<NaivePacket> naivePackets = parser.fromJson(new FileReader(input), new TypeToken<ArrayList<NaivePacket>>(){}.getType());
        System.out.println("Done Parsing");
        naivePackets.removeIf(link -> link.srcIP == null || link.dstIP == null);

        final int size = naivePackets.size();

        ArrayList<Link> uniqueLinks = new ArrayList<>();
        int j = 0;
        for(NaivePacket npacket : naivePackets){
            j++;
            Link l = new Link(npacket.srcIP, npacket.dstIP);
            if(uniqueLinks.contains(l)){
                l = uniqueLinks.get(uniqueLinks.indexOf(l));
            }else{
                uniqueLinks.add(l);
                //System.out.printf("%d/%d packets, %d links%n",j,size, uniqueLinks.size());
            }

            l.packets.add(new Packet(npacket));
        }

        System.out.println("Done Linking");

        HashSet<String> uniqueIPs = new HashSet<>();

        for(Link link : uniqueLinks){
            uniqueIPs.add(link.srcIP);
            uniqueIPs.add(link.dstIP);
        }

        ArrayList<String> nodeList = new ArrayList<>(uniqueIPs);
        Node[] nodes = new Node[nodeList.size()];
        for(int i = 0; i < nodeList.size(); i++){
            nodes[i] = new Node(nodeList.get(i));
        }

        for(Link link : uniqueLinks) {
            link.source = nodeList.indexOf(link.srcIP);
            link.target = nodeList.indexOf(link.dstIP);
        }

        /*
        ArrayList<HashMap<String, Integer>> list = new ArrayList<>();
        for(Link p : packets){
            for(int i = 0; i < p.layers.size(); i++){
                if(list.size() < (i+1))list.add(new HashMap<>());
                HashMap<String, Integer> map = list.get(i);
                map.compute(p.layers.get(i), (key, value) -> value == null ? 1 : value+1);
            }
        }

        for(int i = 0; i < list.size(); i++){
            HashMap<String, Integer> map = list.get(i);
            int sum = map.values().stream().collect(Collectors.summingInt(integer -> integer));
            map.put("sum",sum);
        }

        for(int i = 0; i < list.size(); i++){
            System.out.printf("Layer %d: %s%n",i+1, list.get(i));
        }*/

        FileWriter writer = new FileWriter("./out/packets.json");

        DataWrapper d = new DataWrapper();
        d.links = uniqueLinks;
        d.nodes = nodes;
        parser.toJson(d, writer);
        writer.close();
        System.out.println("Done");
    }

    /*public void toSunBurst() throws IOException {
        GsonBuilder builder = new GsonBuilder();
        builder.registerTypeAdapter(Link.class, new PacketDeserializer());
        Gson parser = builder.create();

        Link[] packets = parser.fromJson(new FileReader(input), Link[].class);
        SunBurstNode root = new SunBurstNode("ROOT");

        for(Link p : packets){
            SunBurstNode tempRoot = root;
            if(p.layer3 != null){
                tempRoot = tempRoot.addChildIfNotExists(p.layer3);
            }
            if(p.layer4 != null){
                tempRoot = tempRoot.addChildIfNotExists(p.layer4);
            }
            if(p.layer5 != null){
                tempRoot = tempRoot.addChildIfNotExists(p.layer5);
                if(tempRoot.size == null)tempRoot.size = 0;
                tempRoot.size++;
            }

        }

        FileWriter writer = new FileWriter("./out/output.json");
        Gson gson = new Gson();
        gson.toJson(root, writer);
        writer.close();
        System.out.println(root);
    }*/
}