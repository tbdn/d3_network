import java.io.FileNotFoundException;
import java.io.IOException;

public class Main {
    public static void main(String[] args) {
        try {
            Preprocessor p = new Preprocessor(args[0]);
            p.parse(args.length > 1?Integer.parseInt(args[1]):0);
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
