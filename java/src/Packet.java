import wrappers.NaivePacket;

import java.util.ArrayList;

public class Packet {
    public ArrayList<String> layers = new ArrayList<>();
    public String timestamp;

    public Packet(NaivePacket np){
        this.layers = np.layers;
        this.timestamp = np.timestamp;
    }
}
