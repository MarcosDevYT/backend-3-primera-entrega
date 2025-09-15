import mongoose, { Document, Schema } from "mongoose";

export interface IPet extends Document {
  name: string;
  specie: string;
  owner?: mongoose.Types.ObjectId; // referencia al usuario
}

const petSchema = new Schema<IPet>({
  name: {
    type: String,
    required: true,
  },
  specie: {
    type: String,
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },
});

const PetsModel = mongoose.model<IPet>("pets", petSchema);

export default PetsModel;
