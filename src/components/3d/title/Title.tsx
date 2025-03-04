import { Text } from "@react-three/drei";
import { motion } from "framer-motion-3d";

export default function Title() {
  const text = "Name that Tune!";

  return (
    <group>
      {text.split("").map((char, i) => (
        <motion.group
          key={i}
          position={[(i - text.length / 2) * 1.2, 15, 0]}
          initial={{ y: 15 }}
          animate={{ y: 3 }}
          transition={{
            delay: i * 0.1,
            duration: 0.8,
            type: "spring",
            stiffness: 120,
            damping: 8,
          }}
        >
          <Text fontSize={2} letterSpacing={0.2} textAlign="center" anchorX="center" anchorY="middle">
            {char === " " ? "\u00A0" : char}
            <meshStandardMaterial metalness={0.8} roughness={0.2} />
          </Text>
        </motion.group>
      ))}
    </group>
  );
}
