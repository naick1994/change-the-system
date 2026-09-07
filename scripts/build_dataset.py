import json, statistics as st
from collections import defaultdict
from coldhawaii_full import HEATS, RESULT_ORDER, NATIONALITY

ROUND_DEPTH = {"Round 1":1, "Round 2":2, "Round 3":3, "Semi Finals":4, "Final":5}
ROUND_LABEL = {1:"Round 1",2:"Round 2",3:"Round 3",4:"Semi Finals",5:"Final"}

# group rows by heat
by_heat = defaultdict(list)
for round_name, heat_no, name, moves, result, auto_imp, impression, total in HEATS:
    by_heat[heat_no].append({
        "name": name, "moves": moves, "result": result, "auto_imp": auto_imp,
        "impression": impression, "total": total,
        "crashes": sum(1 for m in moves if m == 0),
        "attempts": len(moves),
        "best_move": max(moves) if moves else 0,
    })

heats_out = []
for heat_no in sorted(by_heat.keys()):
    participants = by_heat[heat_no]
    order = RESULT_ORDER[heat_no]
    for p in participants:
        p["placement"] = order.index(p["name"]) + 1
    round_name = [r for r,h,n,m,res,ai,im,t in HEATS if h==heat_no][0]
    heats_out.append({
        "heat_no": heat_no, "round": round_name, "round_depth": ROUND_DEPTH[round_name],
        "participants": sorted(participants, key=lambda p: p["placement"]),
    })

# per-athlete aggregate
athletes = defaultdict(lambda: {"heats":[], "wins":0, "max_round_depth":0})
for h in heats_out:
    for p in h["participants"]:
        a = athletes[p["name"]]
        a["heats"].append({
            "heat_no": h["heat_no"], "round": h["round"], "round_depth": h["round_depth"],
            "placement": p["placement"],
            "opponents": [q["name"] for q in h["participants"] if q["name"] != p["name"]],
            "moves": p["moves"], "result": p["result"], "auto_imp": p["auto_imp"],
            "impression": p["impression"], "total": p["total"],
            "crashes": p["crashes"], "attempts": p["attempts"], "best_move": p["best_move"],
        })
        a["max_round_depth"] = max(a["max_round_depth"], h["round_depth"])
        if p["placement"] == 1:
            a["wins"] += 1

profiles = {}
for name, d in athletes.items():
    heats = d["heats"]
    n_heats = len(heats)
    total_attempts = sum(h["attempts"] for h in heats)
    total_crashes = sum(h["crashes"] for h in heats)
    crash_rate = total_crashes/total_attempts if total_attempts else 0
    avg_result = st.mean(h["result"] for h in heats)
    avg_auto_imp = st.mean(h["auto_imp"] for h in heats)
    avg_impression = st.mean(h["impression"] for h in heats)
    avg_total = st.mean(h["total"] for h in heats)
    best_total = max(h["total"] for h in heats)
    best_move = max(h["best_move"] for h in heats)
    totals = [h["total"] for h in heats]
    stdev_total = st.pstdev(totals) if len(totals) > 1 else 0.0
    profiles[name] = {
        "name": name, "nationality": NATIONALITY.get(name,"?"),
        "n_heats": n_heats, "wins": d["wins"], "max_round_depth": d["max_round_depth"],
        "max_round": ROUND_LABEL[d["max_round_depth"]],
        "total_attempts": total_attempts, "total_crashes": total_crashes, "crash_rate": round(crash_rate,4),
        "avg_result": round(avg_result,3), "avg_auto_imp": round(avg_auto_imp,3),
        "avg_impression": round(avg_impression,3), "avg_total": round(avg_total,3),
        "best_total": round(best_total,2), "best_move": round(best_move,2),
        "stdev_total": round(stdev_total,3),
        "heats": heats,
    }

# field-wide stats (all 18)
all_p = list(profiles.values())
def favg(key): return st.mean(p[key] for p in all_p)
field = {
    "avg_result": round(favg("avg_result"),3),
    "avg_auto_imp": round(favg("avg_auto_imp"),3),
    "avg_impression": round(favg("avg_impression"),3),
    "avg_total": round(favg("avg_total"),3),
    "crash_rate": round(sum(p["total_crashes"] for p in all_p)/sum(p["total_attempts"] for p in all_p),4),
    "best_move": round(favg("best_move"),3),
    "stdev_total": round(favg("stdev_total"),3),
    "n_athletes": len(all_p),
}

winner = "Leonardo Casati"

out = {
    "heats": heats_out,
    "profiles": profiles,
    "field": field,
    "winner": winner,
}
with open("dataset.json","w") as f:
    json.dump(out, f, indent=0, separators=(",",":"))
print("wrote dataset.json,", len(json.dumps(out)), "bytes")
print("athletes:", list(profiles.keys()))
