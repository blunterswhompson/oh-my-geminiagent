import {
  interactive_bash_definition,
} from "./tools/interactive-bash";
import { grep_definition } from "./tools/grep/index";
import { glob_definition } from "./tools/glob";
import {
  ast_grep_search_definition,
  ast_grep_replace_definition,
} from "./tools/ast-grep";
import {
  lsp_goto_definition_definition,
  lsp_find_references_definition,
  lsp_symbols_definition,
  lsp_diagnostics_definition,
  lsp_prepare_rename_definition,
  lsp_rename_definition,
} from "./tools/lsp";
import {
  hashline_edit_definition,
} from "./tools/hashline-edit";
import {
  session_list_definition,
  session_read_definition,
  session_search_definition,
  session_info_definition,
} from "./tools/session-manager";
import {
  task_create_definition,
  task_get_definition,
  task_list_definition,
  task_update_definition,
} from "./tools/task";
import {
  look_at_definition,
} from "./tools/look-at";
import {
  delegate_task_definition,
} from "./tools/delegate-task/index";
import {
  load_rules_definition,
} from "./tools/load-rules";
import {
  task_rnd_definition,
} from "./tools/task-rnd";
import {
  task_rnd_command_definition,
} from "./tools/task-rnd-command";
import {
  git_master_definition,
} from "./tools/git-master";
import {
  research_tool_definitions,
} from "./tools/research/index";
import {
  background_output_definition,
  background_cancel_definition,
} from "./tools/background";
import {
  skill_definition,
} from "./tools/skill";

export const ALL_TOOL_DEFINITIONS = [
  interactive_bash_definition,
  grep_definition,
  glob_definition,
  ast_grep_search_definition,
  ast_grep_replace_definition,
  lsp_goto_definition_definition,
  lsp_find_references_definition,
  lsp_symbols_definition,
  lsp_diagnostics_definition,
  lsp_prepare_rename_definition,
  lsp_rename_definition,
  hashline_edit_definition,
  session_list_definition,
  session_read_definition,
  session_search_definition,
  session_info_definition,
  task_create_definition,
  task_get_definition,
  task_list_definition,
  task_update_definition,
  look_at_definition,
  delegate_task_definition,
  load_rules_definition,
  task_rnd_definition,
  task_rnd_command_definition,
  git_master_definition,
  ...research_tool_definitions,
  background_output_definition,
  background_cancel_definition,
  skill_definition,
];
