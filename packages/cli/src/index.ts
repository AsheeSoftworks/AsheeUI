#!/usr/bin/env node
import { Command } from "commander";
import { registerDoctorCommand } from "./commands/doctor";
import { registerInitCommand } from "./commands/init";

const program = new Command();
program.name("asheeui").description("Ashee UI CLI").version("0.1.0");

registerInitCommand(program);
registerDoctorCommand(program);

program.parseAsync(process.argv);
