import com.google.gson.*;
import wrappers.NaivePacket;

import java.lang.reflect.Type;
import java.util.Set;

public class PacketDeserializer implements JsonDeserializer<NaivePacket> {
    @Override
    public NaivePacket deserialize(JsonElement jsonElement, Type type, JsonDeserializationContext jsonDeserializationContext) throws JsonParseException {
        NaivePacket p = new NaivePacket();
        JsonObject o = (JsonObject) jsonElement;
        // 0 = Frame, 1 = eth, 2 = ip, 3 =
        o = o.get("_source").getAsJsonObject().get("layers").getAsJsonObject();
        Set<String> layers = o.keySet();
        p.timestamp = o.get("frame").getAsJsonObject().get("frame.time_epoch").getAsString();
        if(layers.contains("ip")){
            p.srcIP = o.get("ip").getAsJsonObject().get("ip.src").getAsString();
            p.dstIP = o.get("ip").getAsJsonObject().get("ip.dst").getAsString();
        }
        p.layers.addAll(layers);
        p.layers.remove("data");
        return p;
    }
}
