import com.google.gson.annotations.SerializedName;

import java.util.ArrayList;

public class DataWrapper {
    @SerializedName("nodes")
    public Node[] nodes;
    @SerializedName("links")
    public ArrayList<Link> links;
}
