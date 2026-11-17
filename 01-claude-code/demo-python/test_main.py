from main import nad_prahom, priemer


def test_priemer():
    assert priemer([20.0, 22.0, 24.0]) == 22.0


def test_nad_prahom_vratane_prahu():
    merania = [
        {"cas": "08:00", "teplota": 27.9},
        {"cas": "08:05", "teplota": 28.0},
        {"cas": "08:10", "teplota": 29.5},
    ]
    assert nad_prahom(merania) == ["08:05", "08:10"]
