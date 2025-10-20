import { GlobalStrings } from "@/model/Strings";
import { Paragraph } from "@/components";

export const EmptyList = () => (
    <div className='flex justify-center items-center w-full py-5'>
        <Paragraph textAlign='center'>{GlobalStrings.get("error", "noData")}</Paragraph>
    </div>
)