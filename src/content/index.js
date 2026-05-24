import basics from './01-language-basics.json'
import oop from './02-oop.json'
import strings from './03-strings.json'
import exceptions from './04-exceptions.json'
import arrays from './05-arrays.json'
import collections from './06-collections.json'
import streams from './07-streams.json'
import io from './08-io.json'
import devenv from './09-dev-environment.json'

export const sections = [
  { id: 'basics',      label: 'BASICS',      fullName: 'Java Language Basics',          articles: basics },
  { id: 'oop',         label: 'OOP',          fullName: 'Java OOP',                      articles: oop },
  { id: 'strings',     label: 'STRINGS',      fullName: 'Java Strings',                  articles: strings },
  { id: 'exceptions',  label: 'EXCEPTIONS',   fullName: 'Java Exceptions',               articles: exceptions },
  { id: 'arrays',      label: 'ARRAYS',       fullName: 'Java Arrays',                   articles: arrays },
  { id: 'collections', label: 'COLLECTIONS',  fullName: 'Java Collections',              articles: collections },
  { id: 'streams',     label: 'STREAMS',      fullName: 'Java Streams',                  articles: streams },
  { id: 'io',          label: 'I/O',          fullName: 'Java IO',                       articles: io },
  { id: 'devenv',      label: 'DEV ENV',      fullName: 'Java Development Environment',  articles: devenv },
]
