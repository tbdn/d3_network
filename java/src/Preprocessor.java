import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.reflect.TypeToken;

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
        builder.registerTypeAdapter(Link.class, new PacketDeserializer());
        Gson parser = builder.create();
        ArrayList<Link> links = parser.fromJson(new FileReader(input), new TypeToken<ArrayList<Link>>(){}.getType());
        links.removeIf(link -> link.srcIP == null || link.dstIP == null);
        HashSet<String> uniqueIPs = new HashSet<>();

        for(Link link : links){
            uniqueIPs.add(link.srcIP);
            uniqueIPs.add(link.dstIP);
        }

        uniqueIPs.remove(null);

        ArrayList<String> nodeList = new ArrayList<>(uniqueIPs);
        Node[] nodes = new Node[nodeList.size()];
        for(int i = 0; i < nodeList.size(); i++){
            nodes[i] = new Node(nodeList.get(i));
        }
        System.out.println(uniqueIPs);
        for(Link link : links) {
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
        d.links = links;
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
