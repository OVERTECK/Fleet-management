namespace Backend.DataAccess.DTO.Responses;

public class CostRankingResponse
{
    public required string CarId { get; init; }

    // public required string Model { get; init; }

    public required decimal TotalCost { get; init; }

    public required decimal FuelCost { get; init; }

    public required decimal MaintenanceCost { get; init; }
}