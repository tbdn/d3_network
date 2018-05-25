import java.util.ArrayList;

public class Link {
    public int source;
    public int target;
    public String srcIP;
    public String dstIP;

    public ArrayList<Packet> packets = new ArrayList<>();


    public Link(String srcIP, String dstIP){
        this.srcIP = srcIP;
        this.dstIP = dstIP;
    }

    @Override
    public boolean equals(Object obj) {
        if(obj instanceof Link){
            Link link = (Link)obj;
            return (this.srcIP.equals(link.srcIP) && this.dstIP.equals(link.dstIP))
                    || (this.srcIP.equals(link.dstIP) && this.dstIP.equals(link.srcIP));
        }else{
            return false;
        }
    }
}
