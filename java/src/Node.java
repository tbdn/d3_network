public class Node {
    public String ip;
    public boolean local;
    public Node(String ip){
        this.ip = ip;
        if(ip != null && (ip.startsWith("192.168.") || ip.startsWith("10.") || ip.matches("^172\\.[16..31].*$"))){
            local = true;
        }else {
            local = false;
        }
    }
}
