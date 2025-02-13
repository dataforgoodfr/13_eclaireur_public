import ijson
import json
from decimal import Decimal
from pathlib import Path
import logging

logger = logging.getLogger(__name__)

def decimal_default(obj):
    if isinstance(obj, Decimal):
        return float(obj)
    raise TypeError


def _stack_parent(stack, parent):
    """Add parent to the stack if it is not None"""
    if parent is not None:
        stack.append(parent)

def _pop_and_update_parent(stack, child):
    """Pop the parent from the stack, add child to it, and return the updated parent object"""
    parent = stack.pop()
    # if the parent is a dict, then the top of the stack contains the key for the child object
    if isinstance(parent, dict):
        parent[stack.pop()] = child
    elif isinstance(parent, list):
        parent.append(child)
    return parent

def convert_to_jsonl(input_file, output_file, root):
    with open(input_file, 'rb') as infile, open(output_file, 'w') as outfile:
        parser = ijson.parse(infile)
        current_item = None
        stack = []
        in_target_array = False

        for prefix, event, value in parser:
            if prefix == root and event == 'start_array':
                in_target_array = True
                continue
            elif prefix == root and event == 'end_array':
                return
            elif not in_target_array:
                continue

            # for a map_key, simply add it the key value to the stack
            if event == 'map_key':
                stack.append(value)
            # for primitive types, simply add to current_item
            # if the parent is a dict, then the top of the stack contains the key for the child object
            elif event in ('string', 'number', 'boolean', 'null'):
                if stack and isinstance(current_item, dict):
                    current_item[stack.pop()] = value
                elif isinstance(current_item, list):
                    current_item.append(value)
            # in case of a start_array or start_map, add current_item as parent on the stack
            # and update current_item to be the new array or map
            elif event == 'start_array':
                _stack_parent(stack, current_item)
                current_item = []
            elif event == 'start_map':
                _stack_parent(stack, current_item)
                current_item = {}
            # in case of a end_array or end_map, add current item to its parent, which is a the top of the stack
            elif event == 'end_array':
                if stack:
                    current_item = _pop_and_update_parent(stack, current_item)
            elif event == 'end_map':
                if stack:
                    current_item = _pop_and_update_parent(stack, current_item)
                else:
                    json.dump(current_item, outfile, default=decimal_default, ensure_ascii=False)
                    outfile.write('\n')
                    current_item = None
