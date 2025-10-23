scene VaStControl {
  pad jingle1 color Rio3 trigger playJingle("welcome")
  panel source "Supabase.BusTimes" refresh 30
  trigger voice "next bus to Darley" action showPanel("DarleyBus")
}
