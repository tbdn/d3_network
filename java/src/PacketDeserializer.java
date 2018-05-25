import com.google.gson.*;

import java.lang.reflect.Type;
import java.util.Set;

public class PacketDeserializer implements JsonDeserializer<Link> {
    @Override
    public Link deserialize(JsonElement jsonElement, Type type, JsonDeserializationContext jsonDeserializationContext) throws JsonParseException {
        Link p = new Link();
        JsonObject o = (JsonObject) jsonElement;
        // 0 = Frame, 1 = eth, 2 = ip, 3 =
        o = o.get("_source").getAsJsonObject().get("layers").getAsJsonObject();
        Set<String> layers = o.keySet();
        p.timestamp = o.get("frame").getAsJsonObject().get("frame.time_epoch").getAsString();
        if (layers.contains("eth")){
            p.srcMAC = o.get("eth").getAsJsonObject().get("eth.src").getAsString();
            p.dstMAC = o.get("eth").getAsJsonObject().get("eth.dst").getAsString();
        }
        if(layers.contains("ip")){
            p.srcIP = o.get("ip").getAsJsonObject().get("ip.src").getAsString();
            p.dstIP = o.get("ip").getAsJsonObject().get("ip.dst").getAsString();
        }
        p.layers.addAll(layers);
        p.layers.remove("data");
        return p;
    }
}
