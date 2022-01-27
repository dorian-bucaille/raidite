import { Box, Flex, Link } from "@chakra-ui/react";
import React from "react";

interface NavBarProps {}

export const NavBar: React.FC<NavBarProps> = ({}) => {
  return (
    <Flex bg="red.700" p={3}>
      <Box ml={"auto"}>
        <Link href={"/login"} mr={2}>Login</Link>
        <Link href={"/register"}>Register</Link>
      </Box>
    </Flex>
  );
};
